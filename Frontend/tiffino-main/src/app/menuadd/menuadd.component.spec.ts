import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuaddComponent } from './menuadd.component';

describe('MenuaddComponent', () => {
  let component: MenuaddComponent;
  let fixture: ComponentFixture<MenuaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
