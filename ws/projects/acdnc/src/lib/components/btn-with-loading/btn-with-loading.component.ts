import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'acdnc-btn-with-loading',
  templateUrl: './btn-with-loading.component.html',
  styleUrls: ['./btn-with-loading.component.scss']
})
export class BtnWithLoadingComponent implements OnInit, AfterViewInit{

  @Input() value!: string
  @Input() $loading!: BehaviorSubject<boolean>
  @ViewChild('text') text!: ElementRef
  @ViewChild('loadingWrapper') loadingWrapper!: ElementRef
  @ViewChild('body') body!: ElementRef

  textEl!: HTMLDivElement
  loadingWrapperEl!: HTMLDivElement
  bodyEl!: HTMLDivElement
  constructor(){}

  ngOnInit(){
  }

  ngAfterViewInit(){
    this.textEl = this.text.nativeElement
    this.loadingWrapperEl = this.loadingWrapper.nativeElement
    this.bodyEl = this.body.nativeElement
    this.$loading.subscribe(r => this.onLoadingChange(r))
  }

  onLoadingChange(v: boolean){
    let width
    if(v){
      width = this.bodyEl.offsetWidth
      this.textEl.style.display = 'none'
      this.loadingWrapperEl.style.display = 'flex'
      this.bodyEl.style.width = `${width}px`
    }else{
      this.textEl.style.display = 'flex'
      this.loadingWrapperEl.style.display = 'none'
      this.bodyEl.style.width = `${width}px`
    }
  }

}
