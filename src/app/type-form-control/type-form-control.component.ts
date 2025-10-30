import { Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypeSettings } from '../../models/settings.model';

@Component({
  selector: 'app-type-form-control',
  imports: [ReactiveFormsModule],
  templateUrl: './type-form-control.component.html',
  styleUrl: './type-form-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeFormControlComponent),
      multi: true,
    },
  ],
})
export class TypeFormControlComponent implements ControlValueAccessor {

  default: TypeSettings = {
    font: 'Helvetica',
    size: 12,
    bold: false,
    alignment: 'center',
  }

  fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
      font: this.fb.control(this.default.font),
      size: this.fb.control(this.default.size),
      bold: this.fb.control(this.default.bold),
      alignment: this.fb.control(this.default.alignment),
    });
  
  private onChange: (value: TypeSettings) => void = () => {};
  private onTouched: () => void = () => {};
  
  constructor() {
    // Aggiorna il valore del form padre quando cambia qualcosa
    this.form.valueChanges.subscribe(value => {
      const nonNull = { ...this.default, ...value };
      this.onChange(nonNull);
      this.onTouched();
    });
  }
  
  writeValue(value: TypeSettings | null): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    } else {
      this.form.reset(this.default, { emitEvent: false });
    }
  }
  
  registerOnChange(fn: (value: TypeSettings) => void): void {
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
