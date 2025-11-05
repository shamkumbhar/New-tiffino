import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusinefilterComponent } from './cusinefilter.component';

describe('CusinefilterComponent', () => {
  let component: CusinefilterComponent;
  let fixture: ComponentFixture<CusinefilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusinefilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CusinefilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
