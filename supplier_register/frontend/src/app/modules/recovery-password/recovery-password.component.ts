import { Component, ViewChild } from '@angular/core';
import { PoModalPasswordRecoveryComponent, PoModalPasswordRecoveryType } from '@po-ui/ng-templates';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent {

  @ViewChild(PoModalPasswordRecoveryComponent)
  poModalPasswordRecovery!: PoModalPasswordRecoveryComponent;

  newPassword: boolean = false
  loadingView: boolean = false

  openPasswordRecoveryModal() {
    this.poModalPasswordRecovery.open();
  }

  public recoveryPassword(event: string): void {
    this.newPassword = true;
    this.loadingView = true;
  }

}
