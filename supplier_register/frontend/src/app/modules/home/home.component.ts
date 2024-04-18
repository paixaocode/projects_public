import { Component } from '@angular/core';
import { AuthService } from '../auth-supplier/auth-supplier.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/data-user.service';
import { PoTableColumn, PoTableLiterals } from '@po-ui/ng-components';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isAuthenticated: boolean = false;
  showStars: boolean = false;
  produtoMaisVendido: string = '';
  produtoMenosVendido: string = '';
  quantidadeMaisVendido: number = 0;
  quantidadeMenosVendido: number = 0;
  clickedProductWinner: boolean = true;
  clickedLosertWinner: boolean = false;
  messageMain: string = 'Suas informações em um só lugar'

  produtosMaisVendidos: any[] = [
    { posicaoProdutoMaisVendido: 1, descricaoProdutoMaisVendido: 'Produto 1', quantidadeProdutoMaisVendido: 100 },
    { posicaoProdutoMaisVendido: 2, descricaoProdutoMaisVendido: 'Produto 2', quantidadeProdutoMaisVendido: 90 },
    { posicaoProdutoMaisVendido: 3, descricaoProdutoMaisVendido: 'Produto 3', quantidadeProdutoMaisVendido: 80 },
    { posicaoProdutoMaisVendido: 4, descricaoProdutoMaisVendido: 'Produto 4', quantidadeProdutoMaisVendido: 70 },
    { posicaoProdutoMaisVendido: 5, descricaoProdutoMaisVendido: 'Produto 5', quantidadeProdutoMaisVendido: 60 },

  ];
  constructor(private authService: AuthService,
    private http: HttpClient,
    private userService: UserService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    });
    this.loadingMetrics()
  }

  public readonly columnsProdutosMaisVendidos: Array<PoTableColumn> = [
    { property: 'posicaoProdutoMaisVendido', label: 'Posição' },
    { property: 'descricaoProdutoMaisVendido', label: 'Produto' },
    { property: 'quantidadeProdutoMaisVendido', label: 'Quant. vendida' }
  ];

  public readonly noExistData: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  loadingMetrics() {
    const userData = this.userService.getUserData();
    const token = userData.token;

    const body = { token: token };

    this.produtoMaisVendido = '';
    this.produtoMenosVendido = '';
    this.quantidadeMaisVendido = 0;
    this.quantidadeMenosVendido = 0;

    this.http.post<any>('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/budget/query/metrics', body)
      .subscribe(
        (response) => {

          if (response && response.message && Array.isArray(response.message)) {
            response.message.forEach((item: { type: string; description: string; soldAmount: number; }) => {
              if (item.type === '1') {
                this.produtoMaisVendido = item.description;
                this.quantidadeMaisVendido = item.soldAmount;
              } else if (item.type === '2') {
                this.produtoMenosVendido = item.description;
                this.quantidadeMenosVendido = item.soldAmount;
              }
            });
          } else {

            this.produtoMaisVendido = 'Nenhum produto mais vendido encontrado';
            this.produtoMenosVendido = 'Nenhum produto menos vendido encontrado';

            const elementProdutoMaisVendido = document.getElementById('produtoMaisVendido');
            if (elementProdutoMaisVendido) {
              elementProdutoMaisVendido.classList.remove('custom-text-produto-mais-vendido');
              elementProdutoMaisVendido.classList.add('custom-text-erro');
            }
            const elementProdutoMenosVendido = document.getElementById('produtoMenosVendido');
            if (elementProdutoMenosVendido) {
              elementProdutoMenosVendido.classList.remove('custom-text-produto-menos-vendido');
              elementProdutoMenosVendido.classList.add('custom-text-erro');
            }
          }
        },
        (error) => {
          console.error('Erro ao carregar métricas:', error);
          this.produtoMaisVendido = 'NÃO FOI POSSÍVEL CARREGAR AS MÉTRICAS';
          this.produtoMenosVendido = 'NÃO FOI POSSÍVEL CARREGAR AS MÉTRICAS';

          // Adicionar classes de erro aos elementos, se existirem
          const elementProdutoMaisVendido = document.getElementById('produtoMaisVendido');
          if (elementProdutoMaisVendido) {
            elementProdutoMaisVendido.classList.remove('custom-text-produto-mais-vendido');
            elementProdutoMaisVendido.classList.add('custom-text-erro');
          }
          const elementProdutoMenosVendido = document.getElementById('produtoMenosVendido');
          if (elementProdutoMenosVendido) {
            elementProdutoMenosVendido.classList.remove('custom-text-produto-menos-vendido');
            elementProdutoMenosVendido.classList.add('custom-text-erro');
          }
        }
      );
  }

  clickWidgetProductWinner($event: any) {
    let response = this.clickedProductWinner = true;
    this.messageMain = 'Produtos mais vendidos'
    return response
  }

  clickWidgetProductLoser($event: any) {
    let response = this.clickedLosertWinner = true;
    this.messageMain = 'Produtos menos vendidos'
    return response
  }

  onClickButtonVoltar() {
    this.clickedProductWinner = false;
    this.messageMain = 'Suas informações em um só lugar'
  }
}
