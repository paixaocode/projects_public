import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-supplier.service';
import { UserService } from 'src/app/services/data-user.service';

@Component({
  selector: 'app-auth-supplier',
  templateUrl: './auth-supplier.component.html',
  styleUrls: ['./auth-supplier.component.css']
})
export class AuthSupplierComponent {
  
  @ViewChild('modal', { static: true }) modal: PoModalComponent | undefined;

  clickEntry: boolean = false;
  cnpj: string = '';
  password: string = '';
  disabledButtonLogin: boolean = true;
  loadingButtonLogin: boolean = false;

  constructor(
    private http: HttpClient,
    public poNotification: PoNotificationService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  public onCNPJChangeModel(cnpj: string): void {
    this.cnpj = cnpj;
    this.validateForm();
  }

  public onPasswordChangeModel(password: string): void {
    this.password = password;
    this.validateForm();
  }

  private validateForm(): void {
    const isCnpjValid = this.cnpj.length === 14;
    const isPasswordValid = this.password.length === 6;

    this.disabledButtonLogin = !(isCnpjValid && isPasswordValid);
  }

  public registerButton(): void {
    this.router.navigate(['/register']);
  }

  public loginButton(): void {
    const apiUrl = 'http://localhost:8080/rest/supplierportal/api/service/supplier/v1/auth';

    const requestBody = {
      cnpj: this.cnpj,
      password: this.password
    };

    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        this.poNotification.success('Login realizado com sucesso!')
        this.router.navigate(['/home']);
        this.authService.setAuthenticated(true)
        this.userService.setUserData(response)
      },
      (error: any) => {
        this.poNotification.error('Erro ao tentar fazer login. Verifique suas credenciais.');
      }
    );
  }

  public forgotPassword() {
    return this.router.navigate(['/recovery-password']);
  }

}
