import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSupplierComponent } from './auth-supplier.component';

describe('AuthSupplierComponent', () => {
  let component: AuthSupplierComponent;
  let fixture: ComponentFixture<AuthSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthSupplierComponent]
    });
    fixture = TestBed.createComponent(AuthSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
