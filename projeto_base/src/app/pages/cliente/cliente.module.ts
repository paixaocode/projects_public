import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente.routing.module';
import { ClienteComponent } from './cliente.component';
import { PoPageModule } from '@po-ui/ng-components';
import { ConsultaClienteModule } from 'src/app/modules/consulta-cliente/consulta-cliente.module';


@NgModule({
  declarations: [
    ClienteComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    PoPageModule,
    ConsultaClienteModule,
  ]
})
export class ClienteModule { }
