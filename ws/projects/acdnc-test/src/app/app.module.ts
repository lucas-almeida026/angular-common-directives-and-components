import { BWL } from './btn-with-loading/bwl.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { AcdncModule } from 'acdnc';

@NgModule({
  declarations: [
    AppComponent,
    BWL
  ],
  imports: [
    BrowserModule,
    AcdncModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
