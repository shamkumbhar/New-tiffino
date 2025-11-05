import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPartnerProfileComponent } from './delivery-partner-profile.component';

describe('DeliveryPartnerProfileComponent', () => {
  let component: DeliveryPartnerProfileComponent;
  let fixture: ComponentFixture<DeliveryPartnerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPartnerProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryPartnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
