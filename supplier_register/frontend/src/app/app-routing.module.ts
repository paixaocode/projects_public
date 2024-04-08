import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './modules/register/register.component';
import { SuccessComponent } from './modules/success/success.component';
import { ErrorComponent } from './modules/error/error.component';
import { AuthSupplierComponent } from './modules/auth-supplier/auth-supplier.component';
import { RecoveryPasswordComponent } from './modules/recovery-password/recovery-password.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { SolicitacoesDeVendaComponent } from './modules/solicitacoes-de-venda/solicitacoes-de-venda.component';
import { MenuComponent } from './modules/menu/menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthSupplierComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: 'home', component: HomeComponent, },//canActivate: [AuthGuard] },
      { path: 'solicitacoes-de-venda', component: SolicitacoesDeVendaComponent },
    ]
  },
  { path: 'register', component: RegisterComponent }, 
  { path: 'success', component: SuccessComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'recovery-password', component: RecoveryPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
