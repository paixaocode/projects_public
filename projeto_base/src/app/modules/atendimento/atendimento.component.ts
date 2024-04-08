import { Component, Input, OnInit } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.scss']
})
export class AtendimentoComponent implements OnInit {

  @Input() cliente: string
  @Input() operacao = '';

  // Lista OPERACAO
  public readonly columnsItensOperacao: Array<PoTableColumn> = [
    { property: 'lado', label: 'Lado' },
    { property: 'qtd', label: 'Quantidade' },
    { property: 'codigo', label: 'codigo' },
    { property: 'apelido', label: 'apelido' },
    { property: 'cor', label: 'Cor' },
    { property: 'cb1', label: 'CB1' },
    { property: 'cb2', label: 'CB2' },
    { property: 'qtd', label: 'CBText' },
  ];

  listItensOperacao = [
    { 
      lado: 'Direito', 
      qtd: 123.45,
      codigo: '00001',
      apelido: 'Apelido 1',
      cor: 'Preto',
      cb1: 'CB1',
      cb2: 'CB2',
    },
    { 
      lado: 'Esquerdo', 
      qtd: 67.89,
      codigo: '00002',
      apelido: 'Apelido 2',
      cor: 'Azul',
      cb1: 'CB1',
      cb2: 'CB2',
    },
  ]

  public readonly literalsItensOperacao: PoTableLiterals = {
    noData: 'Não há itens para apresentar',
  };

  public actions: Array<PoTableAction> = [
    {
      //action: this.editContato.bind(this),
      icon: 'po-icon-edit',
      label: 'Editar',
    },
    {
      //action: this.deleteContato.bind(this),
      icon: 'po-icon-delete',
      label: 'Excluir',
      type: 'danger',
    },
  ];

  constructor() { }

  ngOnInit(): void {
    console.log("init atendimento");
  }
  
  changeOperacao(event: string){

    this.operacao = event;

  }
}
