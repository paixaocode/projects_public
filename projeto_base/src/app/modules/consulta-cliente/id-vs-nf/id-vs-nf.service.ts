import { Injectable } from '@angular/core';

@Injectable()
export class IdVsNfService {

  constructor() { }

  getItems() {
    return [
        {
            campanha: '',
            startOn: '',
            usuario: '',
        },
    ];
  }
}
