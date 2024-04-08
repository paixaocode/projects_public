import { Component, OnInit } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.scss']
})
export class ContatosComponent implements OnInit {

  // Contatos
  public readonly columnsContatos: Array<PoTableColumn> = [
    { property: 'codContato', label: 'Código' },
    { property: 'descContato', label: 'Nome' },
  ];

  listContatos = [
    { codContato: '000001', descContato: 'Descrição Contato 2' },
    { codContato: '000002', descContato: 'Descrição Contato 3' },
    { codContato: '000003', descContato: 'Descrição Contato 3' }
  ]

  public readonly literalsContato: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
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
  }

}
