import { Injectable } from "@angular/core";

@Injectable()
export class CreditosTrocasService {
    
    getCreditos() {

        return [
          {
            data: '01-24-2023',
            tipo: 'C',
            documento: 'EH1784',
            nf: '001235205',
            dataEmissao: '01-24-2023',
            observacao: '0000001 EMP: 01-01',
            credito: 50,
            debito: 50,
          },
          {
            data: '01-24-2023',
            tipo: 'C',
            documento: 'EH1784',
            nf: '001235205',
            dataEmissao: '01-24-2023',
            observacao: '0000001 EMP: 01-01',
            credito: 50,
            debito: 50,
          },
        ];
    }

    getTrocas() {

      return [
        {
          data: '01-24-2023',
          tipo: 'C',
          documento: 'EK2129',
          nf: '0341',
          dataEmissao: '01-24-2023',
          observacao: 2,
          credito: 1,
          debito: 0,
        },
        {
          data: '01-24-2023',
          tipo: 'D',
          documento: 'EK2129',
          nf: '001235205',
          dataEmissao: '01-24-2023',
          observacao: 2,
          credito: 1,
          debito: 0,
        },
      ];
  }
}

/*,*/