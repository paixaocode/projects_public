import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';
import { GreetingsService } from './services/greetings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

   
  menuItems: Array<PoMenuItem> = []
  saudacao: string = ''

  constructor(private greetingsService: GreetingsService, private router: Router){
    this.saudacao = this.greetingsService.saudacao
  }

  isRotaLogin(): boolean{
    return this.router.url === '/';
  }

  readonly menus: Array<PoMenuItem> = [

    { label: 'Solicitações de venda', link: "solicitacoes-de-venda", shortLabel: "Solicit. ven", icon: "po-icon po-icon-pushcart" },
    { label: 'Histórico de pagamentos', link: "", shortLabel: "Hist. pgtos", icon: "po-icon po-icon-payment" },
    { label: 'Sair', link: '/', shortLabel: 'Sair', icon: 'po-icon-exit' }
  ];
}
