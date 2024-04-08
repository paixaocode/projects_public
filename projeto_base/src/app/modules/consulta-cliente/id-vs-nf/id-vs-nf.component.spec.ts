import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdVsNfComponent } from './id-vs-nf.component';

describe('IdVsNfComponent', () => {
  let component: IdVsNfComponent;
  let fixture: ComponentFixture<IdVsNfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdVsNfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdVsNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
