import { HttpClient } from '@angular/common/http';
import { CssSelector } from '@angular/compiler';
import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TCSSCompilerService{

  private render: Renderer2

  constructor(
    private http: HttpClient,
    rendererFactory: RendererFactory2
  ){
    this.render = rendererFactory.createRenderer(null, null)
  }

  async setStyle(context: any, filePath: string){
    let text = await this.http.get(filePath + '.acss', {responseType: 'text'}).toPromise()
    let tabSize = 0
    if(text.substring(text.length - 1, text.length).charCodeAt(0) != 13) text += '\n'
    if(text.length == 0) return
    const blocks = this.getBlocks(text)
    blocks.forEach(b => {
      const lines = b.split('\n').filter(e => e.length > 0 && e.charCodeAt(0) != 13)
      lines.forEach(l => {
        if(b.includes(' use:')){
          const selector = b.substring(0, b.indexOf(' use:')).trim()
          const identifier = selector.split('').filter(e => e == '$' || e == '.' || e == '#').join('')
          if(identifier.length > 1){
            throw new Error(`${selector} is not a valid selector`)
          }else{
            const trimmedSelector = selector.replace(identifier, '')
            if(identifier == '$'){
              if(Object.keys(context).includes(trimmedSelector)){
                const instructions = l.split(':')
                if(instructions[0].trim().length != instructions[0].length && tabSize == 0){
                  tabSize = instructions[0].length - instructions[0].trim().length
                }
                const tabs = instructions[0].length - instructions[0].trim().length != 0 ?
                (instructions[0].length - instructions[0].trim().length) / tabSize : 0
                if(!!tabs){
                  if(tabs % 2 != 0){
                    const atribute = !instructions[0].includes(' use') ?
                    instructions[0].trim() :
                    ''
                    const value = instructions[1].length > 1 ?
                    instructions[1].trim() :
                    ''
                    if(atribute && value){
                      const el = context[trimmedSelector].nativeElement
                      if(Object.keys(el.style).includes(atribute)){
                        el.style[atribute] = value
                      }
                    }
                    if(instructions[0].includes(' use')){
                      console.log(instructions[0])
                    }
                  }else{
                    console.log(instructions)
                  }
                }
              }else{
                throw new Error(`${trimmedSelector} is not a valid ViewChild`)
              }
            }else{

            }
          }
        }
      })
    })
    return ''
  }

  private getBlocks(text: string): string[]{
    const blocks = []
    let index = 0
    let safe = 0
    const obj: {[key: string]: any} = {}
    let tabSize = 0
    let lastKey = ''
    text.split('\n').forEach(l => {
      if(l.includes(' use:')){
        l = l.split('').map(e => e.charCodeAt(0)).filter(e => e != 13).map(e => String.fromCharCode(e)).join('')
        const selector = l.substring(0, l.indexOf(' use:'))
        obj[selector] = {}
        if(l.length != l.trim().length && tabSize == 0) tabSize = (l.length - 1) - l.trim().length
        if(l.length != l.trim().length){          
          console.log(lastKey)
          const instructions = l.split(':').map(e => e.trim())
          console.log(instructions)
          const preObj: {[key: string]: any} = {}
          preObj[selector] = {}
          if(!!instructions[0]){
            obj[lastKey][instructions[0]] = instructions[1]
          }
        }
        lastKey = selector
      }else{
        const instructions = l.split(':').map(e => e.trim())
        const preObj: {[key: string]: any} = {}
        if(!!instructions[0]){
          preObj[instructions[0]] = instructions[1]
          obj[lastKey] = {...obj[lastKey], ...preObj}
        }
      }
    })
    console.log(obj)
    // console.log(blocks.forEach(e => {
    //   console.log(e.lastIndexOf(' use') != e.indexOf(' use'))
    // }))
    return ['']
    // return blocks
  }
}