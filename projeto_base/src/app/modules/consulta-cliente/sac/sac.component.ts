import { Component, OnInit } from '@angular/core';
import { PoInfoOrientation, PoTableAction, PoTableColumn, PoTableLiterals, PoTableRowTemplateArrowDirection } from '@po-ui/ng-components';
import { SacService } from './sac.service';

@Component({
  selector: 'app-sac',
  templateUrl: './sac.component.html',
  styleUrls: ['./sac.component.scss'],
  providers: [ SacService ]
})
export class SacComponent implements OnInit {

  // Registro de Recepção
  public readonly columnsSAC: Array<PoTableColumn> = [
    { property: 'id', label: 'IX', width: '15%' },
    { property: 'idPai', label: 'IX Pai', width: '15%' },
    { property: 'origem', label: 'Origem', type: 'subtitle', width: '20%', subtitles: [
      {value: 'T', color: 'color-01', label: 'Origem T', content: 'T'},
      {value: 'K', color: 'color-12', label: 'Origem K', content: 'K' },
    ]},
    { property: 'dia', label: 'Data', type: 'date', width: '10%' },
    { property: 'contato', label: 'Contato', width: '20%' },
    { property: 'codAcao', label: 'Ação', width: '20%' },
  ];

  public readonly literalsSAC: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  public actions: Array<PoTableAction> = [
    {
      //action: this.editContato.bind(this),
      icon: 'fa fa-phone',
      label: 'Atender',
    },
    {
      //action: this.deleteContato.bind(this),
      icon: 'fa fa-users',
      label: 'Acompanhar',
    },
    {
      //action: this.deleteContato.bind(this),
      icon: 'fa fa-reply-all',
      label: 'Retornar ao Cliente',
    },
  ];

  itensSAC: any[] = []
  right: PoTableRowTemplateArrowDirection = PoTableRowTemplateArrowDirection.Left;
  horizontal: PoInfoOrientation = PoInfoOrientation.Horizontal;

  constructor(
    private sacService: SacService
  ) { }

  ngOnInit(): void {
    this.itensSAC = this.sacService.getItems();
  }

  isUndelivered(row: any, index: number) {
    return row.origem == 'T';
  }

}
