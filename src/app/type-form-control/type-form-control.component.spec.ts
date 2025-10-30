import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFormControlComponent } from './type-form-control.component';

describe('TypeFormControlComponent', () => {
  let component: TypeFormControlComponent;
  let fixture: ComponentFixture<TypeFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeFormControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
