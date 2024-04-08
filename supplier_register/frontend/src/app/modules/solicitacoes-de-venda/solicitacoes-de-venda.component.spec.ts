import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesDeVendaComponent } from './solicitacoes-de-venda.component';

describe('SolicitacoesDeVendaComponent', () => {
  let component: SolicitacoesDeVendaComponent;
  let fixture: ComponentFixture<SolicitacoesDeVendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitacoesDeVendaComponent]
    });
    fixture = TestBed.createComponent(SolicitacoesDeVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
