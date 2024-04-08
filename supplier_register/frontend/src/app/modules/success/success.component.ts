import { Component } from '@angular/core';
import { DataFormService } from 'src/app/services/data-form.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {

  constructor(
    private dataFormService: DataFormService
  ) { }

  public onClickButton() {
    const data = this.dataFormService.getData();

    if (data) {
      const pdf = new jsPDF();

      pdf.text(`[Informações do Formulário]`, 10, 10);
      pdf.text(`Razão social: ${data.razaoSocial}`, 10, 20);
      pdf.text(`Nome fantasia: ${data.nomeFantasia}`, 10, 30);
      pdf.text(`CNPJ: ${data.cnpj}`, 10, 40);
      pdf.text('', 10, 50);
      pdf.text('Por segurança algumas informações não serão exibidas!', 10, 60);
      pdf.text(`Caso precise do token, é: ${data.token}`, 10, 70);

      pdf.save('formulario.pdf');
    }
    return true;
  }
}
