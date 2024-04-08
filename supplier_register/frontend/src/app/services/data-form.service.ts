import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFormService {

  constructor() { }

  private registrationData: any = {};

  setData(data: any) {
    this.registrationData = data;
  }

  getData() {
    return this.registrationData;
  }
}
