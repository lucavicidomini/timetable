import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsetFormControlComponent } from './inset-form-control.component';

describe('InsetFormControlComponent', () => {
  let component: InsetFormControlComponent;
  let fixture: ComponentFixture<InsetFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsetFormControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsetFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
