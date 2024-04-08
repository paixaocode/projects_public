import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user/user.service";

@Injectable( { providedIn: 'root'} )
export class LoginGuard implements CanActivate {
    logado = false
    constructor(
        private router: Router,
        private userSerice: UserService
    ){}
    
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

            console.log('Login Guard');
            if( this.userSerice.isLogged() ){
                console.log(this.userSerice.isLogged());
                return true;
            } else {
                this.router.navigateByUrl('login');
                return false;
            }
        }
}