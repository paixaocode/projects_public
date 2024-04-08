import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import Typed from 'typed.js';
import { PoNotificationService } from '@po-ui/ng-components';
import { NgForm } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataFormService } from '../../services/data-form.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('myForm', { static: true }) myForm: NgForm | undefined;
  @ViewChild('tokenInput', { static: false }) tokenInput: ElementRef | undefined;

  constructor(
    public poNotification: PoNotificationService,
    private router: Router,
    private http: HttpClient,
    private dataFormService: DataFormService
  ) { }

  showSubmitButton: boolean = false;
  typedInstance1: Typed | undefined;
  typedInstance2: Typed | undefined;
  typedDestroy: boolean = false;
  disableButtonReturnStepOne: boolean = false;
  returnStepOne: boolean = false;

  tokenValidado: boolean = false;

  razaoSocial: string = '';
  nomeFantasia: string = '';
  cnpj: string = '';
  inscricaoEstadual: string = '';
  token: string = '';
  textProgressBar: string = 'Aqui está o seu progresso'
  pais: string = 'BRA'
  telefone: string = ''
  celular: string = ''
  email: string = ''
  redesocial: string = ''
  cep: string = ''
  logradouro: string = ''
  estado: string = ''
  municipio: string = ''
  password: string = ''
  complemento: string = ''
  faturamento: string = ''

  stage: number = 1

  loadingButtonFinalizar: boolean = false


  stepStageTwo: boolean = false
  stepStageTree: boolean = false

  messageMain: string = 'Preencha as informações gerais da sua empresa!'
  messageTextEnd: string = 'Queremos saber de onde você é!'
  //barra de progresso
  progressBar: number = 0

  ngOnInit(): void {
    this.initTypingEffect();
  }

  ngOnDestroy(): void {
    if (this.typedInstance1) {
      this.typedInstance1.destroy();
    }
    if (this.typedInstance2) {
      this.typedInstance2.destroy();
    }
  }

  initTypingEffect() {
    const options1 = {
      strings: ["Olá, futuro supplier, como vai?"],
      typeSpeed: 25,
    };

    const options2 = {
      strings: ["Você está pronto para uma parceria promissora!?"],
      typeSpeed: 40,
      startDelay: 2000,
      onComplete: () => {
        setTimeout(() => {
          this.showSubmitButton = true;
        }, 500);
      }
    };

    this.typedInstance1 = new Typed('#typedText1', options1);
    this.typedInstance2 = new Typed('#typedText2', options2);
  }

  buttonStageReady() {
    if (this.typedInstance1) {
      this.typedInstance1.destroy();
    }
    if (this.typedInstance2) {
      this.typedInstance2.destroy();
    }

    this.showSubmitButton = false;
    this.typedDestroy = true;

    this.stageRegisterOne();
  }

  onDestroy() {
    return this.typedDestroy;
  }

  stageRegisterOne(): void {
    if (!this.onDestroy()) {
      this.poNotification.error('Houve um erro! Por favor entre em contato com administrador!');
    }
  }

  onChange(fieldName: string, event: any): void {

    if (fieldName === 'cep') {
      const viaCepUrl = `https://viacep.com.br/ws/${this.cep}/json/`;

      axios.get(viaCepUrl)
        .then(response => {
          const data = response.data;

          this.logradouro = data.logradouro;
          this.estado = data.uf;
          this.municipio = data.localidade;
          this.complemento = data.complemento;
        })
        .catch(error => {
          this.poNotification.error(`O CEP: ${this.cep} não foi encontrado! Digite o CEP corretamente.`);
        });
    }

    if (fieldName === 'token') {
      this.verifyToken();
    }
  }

  private verifyToken(): void {
    this.http.get('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/token')
      .subscribe(
        (response: any) => {
          const tokens = response.data.map((item: any) => item.token);
          const enteredToken = this.token;

          if (tokens.includes(enteredToken)) {
            this.poNotification.success('Token validado!');
            this.tokenValidado = true;
          } else {
            this.poNotification.error('Token inválido. Por favor, verifique e tente novamente.');
          }
        },
        error => {
          this.poNotification.error('Houve um erro ao processar o token. Por favor, tente novamente.');
        }
      );
  }

  storeDataObject(): any {
    let store: any = {};

    store.razaoSocial = this.razaoSocial;
    store.nomeFantasia = this.nomeFantasia;
    store.cnpj = this.cnpj;
    store.inscricaoEstadual = this.inscricaoEstadual;
    store.token = this.token;
    store.pais = this.pais;
    store.telefone = this.telefone;
    store.celular = this.celular;
    store.email = this.email;
    store.cep = this.cep;
    store.logradouro = this.logradouro;
    store.estado = this.estado;
    store.municipio = decodeURIComponent(this.municipio)
    store.password = this.password;

    return store;
  }

  returnFormStepOne() {
    this.returnStepOne = true;
    this.stepStageTwo = false;
  }

  returnFormStepTwo() {
    this.stepStageTwo = true;
    this.stepStageTree = false;
    this.typedDestroy = true;
  }

  onSubmit(form: NgForm): void {

    if (!this.tokenValidado) {
      this.poNotification.error('Token inválido. Por favor, verifique e tente novamente.')
    }
    if (this.tokenValidado) {
      if (this.returnStepOne && !this.stepStageTwo) {
        this.returnStepOne = false;
        this.stepStageTwo = true;
      }

      if (form.valid && this.stage === 1) {
        this.stepStageTwo = true;
        this.messageMain = 'Queremos os seus contatos'
        this.stage = 2
      }

      if (form.valid && this.stage === 2) {
        this.stage = 3
      }
    }
  }

  onSubmitEnd(form: NgForm): void {
    if (form.valid && this.stage === 3) {
      this.typedDestroy = false;
      this.stepStageTwo = false;
      this.stepStageTree = true;
    }
  }

  onFinish(form: NgForm): void {
    if (form.valid && this.stage === 3) {
      this.loadingButtonFinalizar = true;
      const postData = this.storeDataObject();

      this.http.post('http://localhost:8080/rest/supplierportal/api/service/supplier/v1/register', postData)
        .subscribe(
          response => {
            this.router.navigate(['/success']);
          },
          error => {
            this.poNotification.error('Houve um erro ao processar o registro. Revise os dados e tente novamente.');
            this.loadingButtonFinalizar = false;
          }
        );
      //Armazena os dados usado no cadastro
      this.dataFormService.setData(postData);

    }
  }
}
