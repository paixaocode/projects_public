import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroRecepcaoComponent } from './registro-recepcao.component';

describe('RegistroRecepcaoComponent', () => {
  let component: RegistroRecepcaoComponent;
  let fixture: ComponentFixture<RegistroRecepcaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroRecepcaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroRecepcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
