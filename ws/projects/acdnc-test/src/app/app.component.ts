import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  {

  $loading = new BehaviorSubject(false)

  constructor(){}

  c(asd: Event){
    console.log(asd.target)
  }

  t(){
    this.$loading.next(true)
    setTimeout(() => this.$loading.next(false), 2000)
  }
}
