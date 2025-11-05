import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth2SuccessComponentComponent } from './oauth2-success-component.component';

describe('Oauth2SuccessComponentComponent', () => {
  let component: Oauth2SuccessComponentComponent;
  let fixture: ComponentFixture<Oauth2SuccessComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oauth2SuccessComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Oauth2SuccessComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
