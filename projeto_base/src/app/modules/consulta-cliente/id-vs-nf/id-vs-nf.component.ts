import { Component, OnInit } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';

import { IdVsNfService } from './id-vs-nf.service';

@Component({
  selector: 'app-id-vs-nf',
  templateUrl: './id-vs-nf.component.html',
  styleUrls: ['./id-vs-nf.component.scss'],
  providers: [ IdVsNfService ]
})
export class IdVsNfComponent implements OnInit {

  // Campanhas
  public readonly columnsCampanha: Array<PoTableColumn> = [
    { property: 'campanha', label: 'Campanha', width: '40%' },
    { property: 'startOn', label: 'StartOn', width: '40%' },
    { property: 'usuario', label: 'Usário', width: '20%' },
  ];

  public readonly literalsCampanha: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  public actions: Array<PoTableAction> = [
    {
      //action: this.editContato.bind(this),
      icon: 'fa fa-thumbs-down',
      label: 'Bloquear',
      type: 'danger',
    },
    {
      //action: this.deleteContato.bind(this),
      icon: 'fa fa-thumbs-up',
      label: 'Liberar',      
    },
  ];

  listCampanhas: any[] = [];
  emailPedido = 'PB.ce@hotmail.com';
  emailNfe = 'PB.ce@hotmail.com';

  constructor(
    private idvsnfService: IdVsNfService
  ) { }

  ngOnInit(): void {
    this.listCampanhas = this.idvsnfService.getItems();
  }

}
