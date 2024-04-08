import { Component, OnInit, ViewChild } from '@angular/core';

import { PoModalAction, PoModalComponent, PoTableColumn, PoTableDetail, PoTableLiterals, PoTagType } from '@po-ui/ng-components';

import { HistoricoComprasService } from './historico-compras.service';

@Component({
  selector: 'app-historico-compras',
  templateUrl: './historico-compras.component.html',
  styleUrls: ['./historico-compras.component.scss'],
  providers: [ HistoricoComprasService ]
})
export class HistoricoComprasComponent implements OnInit {

  @ViewChild('modalFilterHisCompras', { static: true }) modalFilterHisCompras: PoModalComponent;

  public confirmFilter: PoModalAction = {
    action: () => {
      this.onFilterHistCompras();
    },
    label: 'Aplicar FIltro',
  };

  public cancelFilter: PoModalAction = {
    action: () => {
      this.modalFilterHisCompras.close();
    },
    label: 'Cancelar',
  }

  tagType = PoTagType.Success;

  public airfareDetail: PoTableDetail = {
    columns: [
      { property: 'numero', label: 'Número' },
      { property: 'item', label: 'Item' },
      { property: 'lado', label: 'Lado' },
      { property: 'produto', label: 'Produto' },
      { property: 'descricao', label: 'Descrição' },
      { property: 'quantidade', label: 'Qtd.' },
      { property: 'preco', label: 'Valor', type: 'currency', format: 'BRL' },
    ],
    typeHeader: 'top'
  };

  // Histórico de Compras
  public readonly columnsHistCompras: Array<PoTableColumn> = [
    { property: 'numero', label: 'Número', width: '10%' },
    { property: 'status', label: 'Status', type: 'label', width: '15%', labels: [
      {value: 'produzindo', color: 'color-01', label: 'Em Produção', tooltip: 'Pedido em Produção'},
      {value: 'finalizado', color: 'color-12', label: 'Finalizado', tooltip: 'Pedido Finalizado'},
      {value: 'enviando', color: 'color-08', label: 'Em Transporte', tooltip: 'Pedido em transporte'},
      {value: 'entregue', color: 'color-10', label: 'Entregue', tooltip: 'Pedido entregue'},
      {value: 'cancelado', color: 'color-07', label: 'Cancelado', tooltip: 'Pedido cancelado'}
    ]},
    { property: 'dataEmissao', label: 'Data Emissão', type: 'date', width: '10%' },
    { property: 'codCampanha', label: 'Cod.Campanha', width: '10%' },
    { property: 'codCondPagto', label: 'Cod.Cond.Pg', width: '10%' },
    { property: 'descCondPagto', label: 'Descrição Cond.Pg', width: '20%' },
    { property: 'notaFiscal', label: 'Nota Fiscal', width: '15%' },
    { property: 'serie', label: 'Serie', width: '10%' },
    { property: 'itens', label: 'Itens Pedido', type: 'detail', detail: this.airfareDetail }
  ];

  public readonly literalsHistCompras: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };
  
  listHistCompras: any[] = [];

  constructor(
    private historicoComprasService: HistoricoComprasService
  ) { }

  ngOnInit(): void {
    this.listHistCompras = this.historicoComprasService.getItems()
  }

  openModalFilter(){
    this.modalFilterHisCompras.open();
  }

  onFilterHistCompras() {
    alert('Filtro Aplicado');
    this.modalFilterHisCompras.close();
  }

}
