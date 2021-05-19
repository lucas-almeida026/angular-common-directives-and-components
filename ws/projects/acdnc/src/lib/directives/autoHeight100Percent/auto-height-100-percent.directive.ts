import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { NgResizeObserver, ngResizeObserverProviders } from "ng-resize-observer";

@Directive({
  selector: '[autoHeight100Percent]',
  providers: [...ngResizeObserverProviders]
})
export class autoHeight100Percent implements AfterViewInit{

  element: HTMLElement

  constructor(el: ElementRef, resize$: NgResizeObserver) {
    this.element = el.nativeElement
    let direction = ''
    let ref = window.innerWidth
    window.addEventListener('resize', () => {
      direction = ref - window.innerWidth > 0 ? 'left' : 'right'
      ref = window.innerWidth
    })
    
    setTimeout(() => {      
      const element = (<HTMLDivElement>el.nativeElement) 
      const initialHeight = element.offsetHeight
      resize$.subscribe(() => {
        if(element.parentElement){
          element.style.height = '0px'
          if(direction == 'right'){       
            if(element.parentElement.offsetHeight - element.offsetHeight > 0) {
              element.style.height = `${element.parentElement.offsetHeight - element.offsetHeight + initialHeight}px`
            }else{
              element.style.height = `${initialHeight}px`
            }
          }else{
            element.style.height = `${element.parentElement.offsetHeight}px`
          }
        }
      })
    }, 100)    
  }

  ngAfterViewInit(){
    if(this.element.parentElement){
      if(this.element.offsetHeight < this.element.parentElement.offsetHeight){
        this.element.style.height = `${this.element.parentElement.offsetHeight}px`
      }
    }    
  }
}
