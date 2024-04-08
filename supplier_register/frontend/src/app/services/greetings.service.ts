import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GreetingsService {

  constructor() { }

  get saudacao(): string{
    
    const hora = new Date().getHours();
    
    let saudacao: string;

    if(hora >= 5 && hora < 12){
      saudacao = 'Bom dia,'
    }else if(hora >= 12 && hora < 18){
      saudacao = 'Boa tarde,'
    }else{
      saudacao = 'Boa noite,'
    }
    return saudacao
  }
}
