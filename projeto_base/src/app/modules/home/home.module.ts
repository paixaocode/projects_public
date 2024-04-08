import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoPageModule, PoSlideModule } from '@po-ui/ng-components';

import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { PoPageLoginModule } from '@po-ui/ng-templates';


@NgModule({
  declarations: [ 
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PoPageModule,
    PoSlideModule,
    PoPageLoginModule ,
  ]
})
export class HomeModule { }
