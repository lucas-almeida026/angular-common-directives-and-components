import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: '[transferClickToParentElement]'
})
export class TransferClickToParentElement {
  constructor(el: ElementRef){
    const element = (<HTMLElement>el.nativeElement)
    if(element.parentElement){
      element.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        if(element.parentElement?.click) element.parentElement?.click()
      })
    }
  }
}