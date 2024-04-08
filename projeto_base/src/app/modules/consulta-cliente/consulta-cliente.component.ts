import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { PoTableAction, PoTableColumn, PoTableLiterals, PoTagType } from '@po-ui/ng-components';

@Component({
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.scss']
})
export class ConsultaClienteComponent implements OnInit {

  @Output() cliente = new EventEmitter();

  clienteSelecionado = '';  

  constructor() { }

  ngOnInit(): void {
  }

  valueChange(event: string) {
    this.cliente.emit(event)
    this.clienteSelecionado = event;
  }

  pesquisaCliente(){
    if(this.clienteSelecionado) {
      return '';
    }
    return 'https://webhook.site/082b731f-95de-4bb9-8b35-7ae70aed045f'
  }

}
