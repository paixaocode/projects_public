import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditosTrocasComponent } from './creditos-trocas.component';

describe('CreditosTrocasComponent', () => {
  let component: CreditosTrocasComponent;
  let fixture: ComponentFixture<CreditosTrocasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditosTrocasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditosTrocasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
