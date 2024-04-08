import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { RegisterComponent } from './modules/register/register.component';
import { SuccessComponent } from './modules/success/success.component';
import { ErrorComponent } from './modules/error/error.component';
import { FormsModule } from '@angular/forms';
import { AuthSupplierComponent } from './modules/auth-supplier/auth-supplier.component';
import { RecoveryPasswordComponent } from './modules/recovery-password/recovery-password.component';
import { HomeComponent } from './modules/home/home.component';
import { SolicitacoesDeVendaComponent } from './modules/solicitacoes-de-venda/solicitacoes-de-venda.component';
import { MenuModule } from './modules/menu/menu.module';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SuccessComponent,
    ErrorComponent,
    AuthSupplierComponent,
    RecoveryPasswordComponent,
    HomeComponent,
    SolicitacoesDeVendaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    PoTemplatesModule,
    FormsModule,
    MenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
