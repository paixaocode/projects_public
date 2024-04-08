import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class UserService { 

    private userName = '';

    constructor() { }

    login(){
        this.userName = 'Paulo'
    }

    isLogged() {
        return this.userName;
    }

    logout(){
        this.userName = '';
    }
}