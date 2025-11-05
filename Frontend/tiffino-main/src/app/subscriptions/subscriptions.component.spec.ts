import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionComponent } from './subscriptions.component';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
