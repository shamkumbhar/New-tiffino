import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTocartComponent } from './add-tocart.component';

describe('AddTocartComponent', () => {
  let component: AddTocartComponent;
  let fixture: ComponentFixture<AddTocartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTocartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTocartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
