import { Component, OnInit } from '@angular/core';

import { PoTableColumn, PoTableDetail, PoTableLiterals } from '@po-ui/ng-components';

import { RegistroRecepcaoService } from './registro-recepcao.service';

@Component({
  selector: 'app-registro-recepcao',
  templateUrl: './registro-recepcao.component.html',
  styleUrls: ['./registro-recepcao.component.scss'],
  providers: [RegistroRecepcaoService]
})
export class RegistroRecepcaoComponent implements OnInit {

  public itensRecepcao: PoTableDetail = {
    columns: [
      { property: 'item', label: 'Item' },
      { property: 'numeroDoc', label: 'Número Documento' },
      { property: 'produto', label: 'Produto' },
      { property: 'descricao', label: 'Descrição' },
      { property: 'quantidade', label: 'Qtd.' },
    ],
    typeHeader: 'top'
  };

  // Registro de Recepção
  public readonly columnsRegRecep: Array<PoTableColumn> = [
    { property: 'filial', label: 'Filial', width: '10%' },
    { property: 'numeroRecepcao', label: 'Número', width: '10%' },
    { property: 'dataRecepcao', label: 'Data', type: 'date', width: '10%' },
    { property: 'motivoEnvio', label: 'Motivo', type: 'label', width: '15%', labels: [
      {value: 'TS', color: 'color-01', label: 'Troca Simples', tooltip: 'Troca Simples'},
      {value: 'AV', color: 'color-12', label: 'Simples Aval.', tooltip: 'Simples Aval.'},
      {value: 'TP', color: 'color-02', label: 'Troca Paga', tooltip: 'Troca Paga'},
      {value: 'DV', color: 'color-03', label: 'Devolução', tooltip: 'Devolução'},
    ]},
    { property: 'formaEnvio', label: 'Forma Envio', type: 'subtitle', width: '15%', subtitles: [
      {value: 'A', color: 'color-01', label: 'Forma Envio A', content: 'A'},
      {value: 'B', color: 'color-12', label: 'Forma Envio B', content: 'B' },
      {value: 'C', color: 'color-08', label: 'Forma Envio C', content: 'C' },
    ]},
    { property: 'tipoDocumento', label: 'Tipo Documento', type: 'label', width: '15%', labels: [
      {value: 'FO', color: 'color-01', label: 'Formulário', tooltip: 'Formulário'},
      {value: 'OC', color: 'color-02', label: 'Orçamento', tooltip: 'Orçamento'},
      {value: 'CA', color: 'color-03', label: 'Carta', tooltip: 'Carta'},
      {value: 'NF', color: 'color-04', label: 'Nota Fiscal', tooltip: 'Nota Fiscal'},
    ]},
    { property: 'numeroDocumento', label: 'Número Documento', width: '10%' },
    { property: 'itens', label: 'Itens Recepção', type: 'detail', detail: this.itensRecepcao }
  ];

  public readonly literalsRegRecep: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  listRegRecep: any[] = [];

  constructor(
    private registroRecepcao: RegistroRecepcaoService
  ) { }

  ngOnInit(): void {
    this.listRegRecep = this.registroRecepcao.getItems();
  }

}
