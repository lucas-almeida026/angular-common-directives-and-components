import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

type identifier = '$' | '#' | '.' | '@'

@Injectable({providedIn: 'root'})
export class acss2 {
  constructor(
    private http: HttpClient
  ){}

  async setStyle(context: any, filePath: string){
    const text = await this.http.get(filePath + '.acss', {responseType: 'text'}).toPromise()
    const instructions = this.interpretText(text)
    Object.entries(instructions).forEach((e, i) => {
      const dicItentifier = {
        '$': (name: string, ref: any, instruction?: string[]) => forViewChild(name, ref, instruction),
        '.': (name: string, ref: any, instruction?: string[]) => forClass(name, ref, instruction),
        '#': (name: string, ref: any, instruction?: string[]) => forId(name, ref, instruction),
        '@': (name: string, ref: any, instruction?: string[]) => forHtmlTag(name, ref, instruction)
      }
      if(!e[0].includes('<')){
        const identifier = (<identifier>e[0].substring(0, 1))
        const name = e[0].substring(1, e[0].length)
        dicItentifier[identifier](name, context, e[1])
      }else{
        const arr = e[0].split('<')
        let parent = context
        for(let i = 0; i < arr.length; i++){
          let identifier = (<identifier>arr[i].substring(0, 1))
          let name = arr[i].substring(1, arr[i].length)
          parent = arr.length - 1 == i ?
          parent = dicItentifier[identifier](name, parent, e[1]) :
          parent = dicItentifier[identifier](name, parent)
        }
      }
    })
  }

  private interpretText(text: string){
    const result: {[key: string]: any} = {}
    const lines = text
    .split('\n')
    .map(l => l
      .split('')
      .filter(e => e.charCodeAt(0) != 13)
      .join('')
    )
    .filter(e => !e.includes('//'))
    if(lines[0].length !== lines[0].trim().length) throw new Error('The first line must be in the scope 0')

    const tabsize = lines.reduce((acm, curr) => {
      if(acm !== 0) return acm
      if(curr.length !== curr.trim().length){
        if(curr.length - curr.trim().length == 1) throw new Error('The tab size must be more then 1')
        acm = curr.length - curr.trim().length
      }
      return acm
    }, 0)
    
    let scopeBranch: string[] = []
    lines.forEach((line, i, arr)=> {
      if(line.includes(' set')){
        const head = line.substring(0, line.indexOf(' set'))
        const diff = line.length - line.trim().length
        if(head.includes(' ')){
          if(diff % tabsize !== 0) throw new Error(`Scope error occurred due to tab error at line ${i+1}: "${line}"`)
          scopeBranch[diff / tabsize] = line.substring(diff, line.indexOf(' set'))
          if(diff / tabsize < scopeBranch.length - 1) scopeBranch = scopeBranch.slice(0, scopeBranch.length - 1)
        }else{
          scopeBranch = [head]
        }
      }
      if(line.length == 0) scopeBranch = []

      if(!line.includes(' set')){
        const diff = line.length - line.trim().length
        if((diff == 0 && line.length !== 0) || diff % tabsize !== 0) throw new Error(`Scope error occurred due to tab error at line ${i}: "${line}"`)
        if(diff !== 0 && line.length !== 0){
          const index = (diff / tabsize) - 1
          const selector = scopeBranch[index]
          if(selector){
            if(selector.substring(0, 1).replace(/[@\.\$#]/g, '').length > 0) throw new Error(`Invalid selector "${selector.substring(0, 1)}" at line ${i}: ${arr[i - 1]}`)
            const instructions = line.split(':').map(e => e.trim())
            const key = scopeBranch.join('<')
            if(key.split('<').length !== key.split('<').filter(e => e !== "").length) throw new Error(`tabulation error at line ${i}`)
            result[key] = result[key] === undefined ? [instructions] : [...result[key], instructions]
          }          
        }
      }
    })
    return result
  }
}

function forViewChild(name: string, ref: any, instruction?: string[]): {[key: string]: any} {
  if(!ref[name]) throw new Error(`there is no ${name} in the passed reference`)
  if(instruction){
    instruction.forEach(e => {
      if(ref[name].nativeElement.style[e[0]] !== undefined) ref[name].nativeElement.style[e[0]] = e[1]
    })
  }
  return ref[name].nativeElement
}

function forClass(name: string, ref: any, instruction?: string[]): {[key: string]: any} {
  let result: {[key: string]: any}[] = []
  if(ref.nativeElement) ref = ref.nativeElement
  if(!ref.forEach) ref = [ref]
  if(ref[0][name]) if(ref[0][name].nativeElement) return result
  ref.forEach((e: any) => {
    for(let i = 0; i < e.children.length; i++){
      if(!e.children[i].classList) throw new Error(`${e} is not a valid HTML element`)
      if(!e.children[i].classList.contains) throw new Error(`${e} is not a valid HTML element`)
      if(e.children[i].classList.contains(name)) result.push(e.children[i])
    }
    // if(result[0] === undefined) throw new Error(`No child with class name: "${name}" were found`)
    if(instruction && result.length > 0){
      instruction.forEach(e => {              
        result.forEach(el => {
          if(el.style[e[0]] !== undefined) el.style[e[0]] = e[1]
        })
      })
    }
  })        
  return result
}

function forId(name: string, ref: any, instruction?: string[]): {[key: string]: any} {
  console.log(name)
  return {}
}

function forHtmlTag(name: string, ref: any, instruction?: string[]): {[key: string]: any} {
  let result: {[key: string]: any}[] = []
  if(!ref.forEach) ref = [ref]
  ref.forEach((e: any) => {
    for(let i = 0; i < e.children.length; i++){
      if(!e.children[i].nodeName) throw new Error(`${e} is not a valid HTML element`)
      if(e.children[i].nodeName.toLowerCase() == name) result.push(e.children[i])
    }
    if(instruction && result.length > 0){
      instruction.forEach(e => {              
        result.forEach(el => {
          if(el.style[e[0]] !== undefined) el.style[e[0]] = e[1]
        })
      })
    }
  })
  return {}
}