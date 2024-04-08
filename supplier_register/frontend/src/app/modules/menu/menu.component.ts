import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';
import { GreetingsService } from 'src/app/services/greetings.service';
import { UserService } from 'src/app/services/data-user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuItems: Array<PoMenuItem> = []
  saudacao: string = ''
  nameFantasia: string = ''

  constructor(private greetingsService: GreetingsService, private router: Router, private userService: UserService) {
    this.saudacao = this.greetingsService.saudacao
  }

  ngOnInit(): void {
    this.saudacao = this.greetingsService.saudacao;

    // Obtendo os dados do usuário do UserService
    const userData = this.userService.getUserData();
    if (userData && userData.nomeFantasia) {
      this.nameFantasia = userData.nomeFantasia;
    }
  }

  readonly menus: Array<PoMenuItem> = [

    { label: 'Home', link: "home", shortLabel: "Home", icon: "  po-icon po-icon-home" },
    { label: 'Solicitações de venda', link: "solicitacoes-de-venda", shortLabel: "Solicit. ven", icon: "po-icon po-icon-pushcart" },
    { label: 'Sair', link: '/', shortLabel: 'Sair', icon: 'po-icon-exit' }
  ];
}
