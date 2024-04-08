import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoDialogService } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginLiterals } from '@po-ui/ng-templates';

import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  customLiterals: PoPageLoginLiterals = {
    yourUserWillBeBlocked: '',
    loginHint: '',
    passwordLabel: '',
    highlightInfo: '',
    loginLabel: '',
    loginPlaceholder: 'Digite seu email ou usuário',
    passwordPlaceholder: 'Digite sua senha',
    welcome: 'Seja bem vindo ao portal PO-UI com Paulo Bindo',
    titlePopover: 'Teste Popover',
    submitLabel: 'Entrar no sistema',
    ifYouTryHarder: 'ifYouTryHarder',
    loginErrorPattern: 'loginErrorPattern',
    passwordErrorPattern: 'passwordErrorPattern',
    registerUrl: 'registerUrl',
    rememberUser: '',
    rememberUserHint: '',
    submittedLabel: '',
    support: '',
    attempts: '',
    createANewPasswordNow: '',
    customFieldErrorPattern: '',
    customFieldPlaceholder: '',
    forgotPassword: '',
    forgotYourPassword: '',
    iForgotMyPassword: '',
  }
  
  constructor(
    private poDialog: PoDialogService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginSubmit(formData: PoPageLogin) {
    
    /*this.poDialog.alert({
      title: 'Authenticate',
      message: this.userService.isLogged()
    });*/

    this.userService.login()
    this.router.navigate(['home']);

  }

}
