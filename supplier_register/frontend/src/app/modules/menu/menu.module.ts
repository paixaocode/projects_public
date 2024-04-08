import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { MenuComponent } from './menu.component';

import { PoMenuModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    PoModule,
    AppRoutingModule,
    PoMenuModule
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent],
})
export class MenuModule {}