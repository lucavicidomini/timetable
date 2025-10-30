import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Inset } from '../../models/settings.model';

@Component({
  selector: 'app-inset-form-control',
  imports: [ReactiveFormsModule],
  templateUrl: './inset-form-control.component.html',
  styleUrl: './inset-form-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InsetFormControlComponent),
      multi: true,
    },
  ],
})
export class InsetFormControlComponent implements ControlValueAccessor {
  
  label = input<string>();

  default: Inset = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    top: this.fb.control(this.default.top),
    right: this.fb.control(this.default.right),
    bottom: this.fb.control(this.default.bottom),
    left: this.fb.control(this.default.left),
  });
  
  private onChange: (value: Inset) => void = () => {};
  private onTouched: () => void = () => {};
  
  constructor() {
    this.form = this.fb.group({
      top: [0],
      right: [0],
      bottom: [0],
      left: [0],
    });
    
    // Aggiorna il valore del form padre quando cambia qualcosa
    this.form.valueChanges.subscribe(value => {
      const nonNull = { ...this.default, ...value };
      this.onChange(nonNull);
      this.onTouched();
    });
  }
  
  writeValue(value: Inset | null): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    } else {
      this.form.reset(this.default, { emitEvent: false });
    }
  }
  
  registerOnChange(fn: (value: Inset) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
