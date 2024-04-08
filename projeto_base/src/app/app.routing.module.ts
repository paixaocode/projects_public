import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/auth/login.guard';

import { LoginComponent } from './login/login.component';
import { MenuComponent } from './modules/menu/menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: '',
    component: MenuComponent,
    //canActivate: [ LoginGuard ],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'atendimento',
        loadChildren: () =>
          import('./pages/iniciar-atendimento/iniciar-atendimento.module').then((m) => m.IniciarAtendimentoModule),
      },
      /*{
        path: 'cliente',
        loadChildren: () =>
          import('./pages/cliente/cliente.module').then((m) => m.ClienteModule),
      },*/
    ]
  },

  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
