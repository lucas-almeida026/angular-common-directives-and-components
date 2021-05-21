import { acss2 } from './ACSSCompiler2.service';
import { TCSSCompilerService } from './ACSSCompiler.service';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

  @ViewChild('body') body!: ElementRef
  @ViewChild('wrapper') wrapper!: ElementRef
  @ViewChild('btn') btn!: ElementRef
  $loading = new BehaviorSubject(false)

  constructor(
    private ACSSCompilerService: TCSSCompilerService,
    private acss2: acss2
  ){}

  ngAfterViewInit(){
    this.acss2.setStyle(this, 'app/teste')
  }

  c(asd: Event){
    console.log(asd.target)
  }

  t(){
    this.$loading.next(true)
    setTimeout(() => this.$loading.next(false), 2000)
  }  
}
