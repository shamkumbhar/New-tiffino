import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodcartComponent } from './foodcart.component';

describe('FoodcartComponent', () => {
  let component: FoodcartComponent;
  let fixture: ComponentFixture<FoodcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodcartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
