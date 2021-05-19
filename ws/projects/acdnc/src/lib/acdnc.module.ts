import { CommonModule } from '@angular/common';
import { BtnWithLoadingComponent } from './components/btn-with-loading/btn-with-loading.component';
import { TransferClickToParentElement } from './directives/transferClickToParentElement/transfer-click-to-parent-element.directive';
import { autoHeight100Percent } from './directives/autoHeight100Percent/auto-height-100-percent.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ 
    //Directives
    autoHeight100Percent,
    TransferClickToParentElement,

    //Components
    BtnWithLoadingComponent
  ],
  imports: [CommonModule],
  exports: [
    autoHeight100Percent,
    TransferClickToParentElement,

    BtnWithLoadingComponent
  ]
})
export class AcdncModule { }
