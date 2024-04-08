import { Component } from '@angular/core';
import { AuthService } from '../auth-supplier/auth-supplier.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    });
  }
  onClickButton() {
  }
}
