import { ComponentFixture, TestBed } from '@angular/core/testing';

import {PaymentcheckoutpageComponent } from './paymentcheckoutpage.component';

describe('PaymentcheckoutpageComponent', () => {
  let component:PaymentcheckoutpageComponent;
  let fixture: ComponentFixture<PaymentcheckoutpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentcheckoutpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentcheckoutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
