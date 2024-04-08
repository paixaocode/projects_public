import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoModule } from '@po-ui/ng-components';

import { AtendimentoComponent } from './atendimento.component';
import { ConsultaClienteModule } from '../consulta-cliente/consulta-cliente.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AtendimentoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    ConsultaClienteModule,
  ],
  exports: [
    AtendimentoComponent
  ]
})
export class AtendimentoModule { }
