import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menus: any = [];

  constructor() { 
    
    // Atendimento
    this.menus.push({
      label: 'Atendimento',
      shortLabel: 'Atendimento',
      icon: 'fa fa-phone',
      link: 'atendimento',
    });

    /*this.menus.push({
      label: 'Cliente',
      shortLabel: 'Cliente',
      icon: 'po-icon po-icon po-icon-users',
      link: 'cliente',
    });*/

    this.menus.push({
      label: 'Sair',
      shortLabel: 'Sair',
      icon: 'po-icon po-icon-exit',
      link: 'login',
    });

  }

  ngOnInit(): void {
  }

}
