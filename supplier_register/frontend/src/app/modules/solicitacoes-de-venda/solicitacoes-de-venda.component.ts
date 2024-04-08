import { Component, ViewChild } from '@angular/core';
import { PoTableColumn, PoTableAction, PoTableLiterals, PoTableComponent, PoTableColumnSpacing } from '@po-ui/ng-components';
import { PoModalComponent } from '@po-ui/ng-components';
import { HttpClient } from '@angular/common/http';
import { PoNotificationService } from '@po-ui/ng-components';
import { UserService } from 'src/app/services/data-user.service';

@Component({
  selector: 'app-solicitacoes-de-venda',
  templateUrl: './solicitacoes-de-venda.component.html',
  styleUrls: ['./solicitacoes-de-venda.component.css']
})
export class SolicitacoesDeVendaComponent {

  itemSelecionado: any;

  constructor(
    private http: HttpClient,
    private poNotification: PoNotificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadSolicitacoes();
  }

  @ViewChild(PoModalComponent, { static: true })
  poModal!: PoModalComponent;

  @ViewChild('modalSemEstoque', { static: true })
  modalSemEstoque!: PoModalComponent;

  messageSolicitacao: string = 'Solicitações de vendas';
  existeSolicitacao: boolean = true;
  loadTable: boolean = false;
  titleModalOrcamento: string = 'Orçamento'
  titleModalOffEstoque: string = 'Você deseja comunicar a falta de estoque?'
  loadingButtonOrcamento: boolean = false
  disabledButtonFecharOrcamento: boolean = false;
  disabledButtonVoltarSemEstoque: boolean = false;
  loadingButtonSemEstoque: boolean = false;

  produtosOrcamento: any[] = [];


  produtoOrcamento: string = ''
  quantidadeOrcamento: string = ''
  vencimentoOrcamento: string = ''
  unidadeMedidaOrcamento: string = ''

  valorProposto: string = ''
  prazoEntrega: string = ''

  public readonly columnsContatos: Array<PoTableColumn> = [
    { property: 'numOrcamento', label: 'Num. Cotação' },
    { property: 'descricaoProduto', label: 'Produto' },
    { property: 'quantidadeProduto', label: 'Quant. solicitada' },
    { property: 'unidadeMedida', label: 'Un. Medida' },
    { property: 'vencimentoSolicitacao', label: 'Entregue até' },
    {
      property: 'Status', type: "label", labels: [
        { value: 'pendente', color: 'color-07', label: 'Pendente' },
        { value: 'enviado', color: 'color-02', label: 'Orçamento enviado' },
        { value: 'semEstoque', color: 'color-08', label: 'Sem estoque' },
        { value: 'aprovado', color: 'color-10', label: 'Orçamento aprovado' },
        { value: 'errorUpdate', color: 'color-06', label: 'Erro!' }
      ]
    },
  ];

  public actions: Array<PoTableAction> = [
    {
      action: this.newBudget.bind(this),
      icon: 'po-icon-edit',
      label: 'Gerar orçamento',
    },
    {
      action: this.offBudget.bind(this),
      icon: 'po-icon-delete',
      label: 'Comunicar falta de estoque',
      type: 'danger',
    },
  ];

  loadSolicitacoes() {
    const userData = this.userService.getUserData();
    const token = userData.token;
  
    const body = { token: token };
  
    this.http.post<any>('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/budget/query', body)
      .subscribe(
        response => {
          if (response.data === 'false') {
            this.existeSolicitacao = false;
          } else if (response.data && response.data.length > 0) {
            this.produtosOrcamento = response.data.flatMap((item: any) => {
              return item.produtos.map((produto: any) => {
                return {
                  codigoProduto: produto[0],
                  numOrcamento: item.numOrcamento,
                  descricaoProduto: produto[1],
                  quantidadeProduto: produto[2],
                  unidadeMedida: produto[3],
                  vencimentoSolicitacao: produto[4],
                  numeroItem: produto[5],
                  numeroProduto: produto[6],
                  Status: produto[7]
                };
              });
            });
            
            //muda o icone na tabela, caso o produto esteja aprovado
            this.actions = this.updateActionsTable();
  
          } else {
            this.existeSolicitacao = false;
          }
        },
        error => {
          console.error('Erro ao carregar as solicitações de venda:', error);
        }
      );
  }

  updateActionsTable(): Array<PoTableAction> {
    const actions: Array<PoTableAction> = [];
    const approvedStatus = ['aprovado'];
  
    const hasApprovedProducts = this.produtosOrcamento.some(produto => approvedStatus.includes(produto.Status));
  
    if (hasApprovedProducts) {
      actions.push(
        {
          action: this.enviaNfe.bind(this),
          icon: 'po-icon po-icon-upload',
          label: 'Enviar NF-e',
          type: 'warning',
        },
        // {
        //   action: this.offBudget.bind(this),
        //   icon: 'po-icon po-icon-mail', // Ícone adicional 1
        //   label: 'Enviar e-mail',
        //   type: 'primary',
        // }
      );
    } else {
      actions.push(
        {
          action: this.newBudget.bind(this),
          icon: 'po-icon-edit',
          label: 'Gerar orçamento',
        },
        {
          action: this.offBudget.bind(this),
          icon: 'po-icon-delete',
          label: 'Comunicar falta de estoque',
          type: 'danger',
        }
      );
    }
  
    return actions;
  }

  //modal orçamento
  newBudget(item: any) {
    if (item.Status === 'semEstoque') {
      this.poNotification.information(`Não é possível gerar orçamento para o produto [${item.descricaoProduto.toUpperCase()}], pois a empresa já foi comunicada sobre a falta de estoque.`);
    } else if (item.Status === 'aprovado') {
      this.poNotification.information(`O produto [${item.descricaoProduto.toUpperCase()}] já teve o orçamento aprovado. Não é possível comunicar falta de estoque.`);
    } else if (item.Status !== 'enviado') {
      this.loadTable = true;
      this.titleModalOrcamento = `ORÇAMENTO PARA: ${item.descricaoProduto.toUpperCase()} `;
      this.produtoOrcamento = item.descricaoProduto;
      this.quantidadeOrcamento = item.quantidadeProduto;
      this.vencimentoOrcamento = item.vencimentoSolicitacao;
      this.unidadeMedidaOrcamento = item.unidadeMedida;
      this.poModal.open();
    } else {
      this.poNotification.warning(`O produto: ${item.descricaoProduto} já teve o orçamento gerado! Não é possível gera-lo novamente.`);
    }
  }
  

  offBudget(item: any) {
    if (item.Status === 'semEstoque') {
      this.poNotification.information(`Você já notificou a falta de estoque para o produto [${item.descricaoProduto.toUpperCase()}].`);
    } else if (item.Status === 'aprovado') {
      this.poNotification.information(`O produto [${item.descricaoProduto.toUpperCase()}] já teve o orçamento aprovado. Não é possível comunicar falta de estoque.`);
    } else {
      this.produtoOrcamento = item.descricaoProduto;
  
      this.itemSelecionado = {
        descricaoProduto: item.descricaoProduto,
        numOrcamento: item.numOrcamento,
        numeroItem: item.numeroItem,
        token: this.userService.getUserData().token
      };
  
      this.modalSemEstoque.open();
    }
  }

  enviaNfe(){
    return true
  }

  //fecha modal orçamento
  closeModalOrcamento(event: any) {
    this.loadTable = false;
    this.loadingButtonOrcamento = false;
    this.disabledButtonFecharOrcamento = false;
    this.deleteValueBudget();
  }

  closeModalSemEstoque(event: any) {
    this.loadTable = false;
    this.loadingButtonSemEstoque = false;
    this.disabledButtonVoltarSemEstoque = false;
    this.deleteValueBudget();
  }

  deleteValueBudget() {
    this.valorProposto = ''
    this.prazoEntrega = ''
  }

  closeModal() {
    this.poModal.close();
  }

  closeModalOffEstoque() {
    this.modalSemEstoque.close();
  }

  public readonly literalsContato: PoTableLiterals = {
    noData: 'Não há contatos para apresentar',
  };

  enviarOrcamento() {
    if (!this.valorProposto.trim() || !this.prazoEntrega.trim()) {
      this.poNotification.warning('Preencha todos os campos para seguir com o oçamento.');
      return;
    }

    this.loadingButtonOrcamento = true;
    this.disabledButtonFecharOrcamento = true;

    const userData = this.userService.getUserData();
    const token = userData.token;

    const produto = this.produtosOrcamento.find(item => item.descricaoProduto === this.produtoOrcamento);

    if (!produto) {
      this.poNotification.error('Produto não encontrado.');
      return;
    }

    const body = {
      token: token,
      numOrcamento: produto.numOrcamento,
      codigoProduto: produto.codigoProduto,
      produtoDescricao: this.produtoOrcamento,
      quantidadeProduto: produto.quantidadeProduto,
      valor_proposto: this.valorProposto,
      prazo_entrega: this.prazoEntrega,
      numeroItem: produto.numeroItem,
      numeroProduto: produto.numeroProduto
    };

    this.http.put('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/budget/update', body)
      .subscribe(
        response => {
          this.poNotification.success('Orçamento enviado com sucesso!');

          // Quando o orçamento for enviado, atualiza o status
          produto.Status = 'enviado';

          this.closeModal();
        },
        error => {
          this.poNotification.error('Erro ao enviar o orçamento!');
        }
      )
      .add(() => {
        this.loadingButtonOrcamento = false;
        this.disabledButtonFecharOrcamento = false;
      });
  }

  confirmarFaltaEstoque() {

    const { numOrcamento, numeroItem, token } = this.itemSelecionado;
  
    this.loadingButtonSemEstoque = true;
    this.disabledButtonVoltarSemEstoque = true;
  
    const body = {
      token: token,
      numOrcamento: numOrcamento,
      numeroItem: numeroItem
    };
  
    this.http.post('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/budget/update/budget-off', body)
      .subscribe(
        response => {
          this.poNotification.success('Falta de estoque comunicada com sucesso!');
          
          //busca o produto usando o find
          const produto = this.produtosOrcamento.find(item => item.numOrcamento === numOrcamento && item.numeroItem === numeroItem);

          if (produto) {
            produto.Status = 'semEstoque';
          }
          
          this.closeModalOffEstoque();
        },
        error => {
          this.poNotification.error('Erro ao comunicar falta de estoque!');
        }
      )
      .add(() => {
        this.loadingButtonSemEstoque = false;
        this.disabledButtonVoltarSemEstoque = false;
      });
  }
}

