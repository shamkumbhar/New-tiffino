import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersRewardsComponent } from './offers-rewards.component';

describe('OffersRewardsComponent', () => {
  let component: OffersRewardsComponent;
  let fixture: ComponentFixture<OffersRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersRewardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffersRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
