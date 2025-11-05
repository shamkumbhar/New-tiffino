import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgatePasswordComponent } from './forgate-password.component';

describe('ForgatePasswordComponent', () => {
  let component: ForgatePasswordComponent;
  let fixture: ComponentFixture<ForgatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgatePasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
