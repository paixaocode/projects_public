import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoModule } from '@po-ui/ng-components';
import { PoPageBlockedUserModule, PoTemplatesModule } from '@po-ui/ng-templates';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { MenuModule } from './modules/menu/menu.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent, LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    PoModule,
    PoTemplatesModule,
    PoPageBlockedUserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
