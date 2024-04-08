import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTabsCustomDirective } from './po-tabs-custom.directive';



@NgModule({
  declarations: [
    PoTabsCustomDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PoTabsCustomDirective
  ]
})
export class PoTabsCustomModule { }
