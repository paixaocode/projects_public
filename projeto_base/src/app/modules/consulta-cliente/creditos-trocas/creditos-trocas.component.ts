import { Component, OnInit } from '@angular/core';
import { PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';
import { CreditosTrocasService } from './creditos-trocas.service';

@Component({
  selector: 'app-creditos-trocas',
  templateUrl: './creditos-trocas.component.html',
  styleUrls: ['./creditos-trocas.component.scss'],
  providers: [ CreditosTrocasService ]
})
export class CreditosTrocasComponent implements OnInit {

  itensCreditos: any[] = [];
  itensTrocas: any[] = [];

  // Columns Creditos
  public readonly columnsCreditos: Array<PoTableColumn> = [
    { property: 'data', label: 'Data', type: 'date', width: '10%' },
    { property: 'tipo', label: 'Tipo', type: 'label', width: '15%', labels: [
      {value: 'C', color: 'color-01', label: 'Credito', tooltip: 'Crédito'},
      {value: 'D', color: 'color-12', label: 'Débido', tooltip: 'Débito'},
    ]},    
    { property: 'documento', label: 'Documento', width: '10%' },
    { property: 'nf', label: 'NF', width: '10%' },
    { property: 'dataEmissao', label: 'Data Emissão', type: 'date', width: '10%' },
    { property: 'observacao', label: 'Observação', width: '10%' },
    { property: 'credito', label: 'Crédito', width: '20%' },
    { property: 'debito', label: 'Débito', width: '15%' },
  ];

  // Columns Trocas
  public readonly columnsTrocas: Array<PoTableColumn> = [
    { property: 'data', label: 'Data', type: 'date', width: '10%' },
    { property: 'tipo', label: 'Tipo', type: 'label', width: '15%', labels: [
      {value: 'C', color: 'color-01', label: 'Credito', tooltip: 'Crédito'},
      {value: 'D', color: 'color-12', label: 'Débido', tooltip: 'Débito'},
    ]},    
    { property: 'documento', label: 'Documento', width: '10%' },
    { property: 'nf', label: 'NF', width: '10%' },
    { property: 'dataEmissao', label: 'Data Emissão', type: 'date', width: '10%' },
    { property: 'observacao', label: 'Observação', width: '10%' },
    { property: 'credito', label: 'Crédito', width: '20%' },
    { property: 'debito', label: 'Débito', width: '15%' },
  ];

  public readonly literalsTabelas: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  constructor(
    private creditoTrocas: CreditosTrocasService
  ) { }

  ngOnInit(): void {
    this.itensCreditos = this.creditoTrocas.getCreditos();
    this.itensTrocas = this.creditoTrocas.getTrocas();
  }

}
