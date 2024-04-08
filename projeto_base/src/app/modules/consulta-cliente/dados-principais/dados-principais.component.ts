import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dados-principais',
  templateUrl: './dados-principais.component.html',
  styleUrls: ['./dados-principais.component.scss']
})
export class DadosPrincipaisComponent implements OnInit {

  codigo='000000/01/S';
  vendedor='00/R/00/R/300';
  nome='PRODUCAO (10.0.0.209) - TOP';
  cgc='4397710700010';
  crm='21321313';
  nomeReduzido='TESTE 2';
  telefone='011-123456789';
  fax='SP12';
  grupo='INDEPENDENTE';
  transportadora='CARTA REGISTRADA';
  endereco='Rua Teste, 999 SAO PAULO SP 18103200';
  enderecoEntrega='Rua Teste Entrega, 999 SAO PAULO SP 18103200';

  constructor() { }

  ngOnInit(): void {
  }

}
