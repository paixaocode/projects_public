import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PoModule, PoPageModule } from '@po-ui/ng-components';

import { ConsultaClienteComponent } from './consulta-cliente.component';
import { ContatosComponent } from './contatos/contatos.component';
import { HistoricoComprasComponent } from './historico-compras/historico-compras.component';
import { DadosPrincipaisComponent } from './dados-principais/dados-principais.component';
import { CreditosTrocasComponent } from './creditos-trocas/creditos-trocas.component';
import { RegistroRecepcaoComponent } from './registro-recepcao/registro-recepcao.component';
import { PoTabsCustomModule } from 'src/app/shared/directives/tabs-background-custom/po-tabs-custom.module';
import { SacComponent } from './sac/sac.component';
import { IdVsNfComponent } from './id-vs-nf/id-vs-nf.component';
import { SaldosComponent } from './saldos/saldos.component';

@NgModule({
  declarations: [
    ConsultaClienteComponent,
    ContatosComponent,
    HistoricoComprasComponent,
    DadosPrincipaisComponent,
    CreditosTrocasComponent,
    RegistroRecepcaoComponent,
    SacComponent,
    IdVsNfComponent,
    SaldosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PoPageModule,
    PoModule,
    PoTabsCustomModule,
  ],
  exports: [
    ConsultaClienteComponent
  ]
})
export class ConsultaClienteModule { }
