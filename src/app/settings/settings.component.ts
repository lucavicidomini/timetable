import { Component, effect, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, tap } from 'rxjs';
import { Inset, Settings, TypeSettings } from '../../models/settings.model';
import { InsetFormControlComponent } from '../inset-form-control/inset-form-control.component';
import { TypeFormControlComponent } from '../type-form-control/type-form-control.component';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, InsetFormControlComponent, TypeFormControlComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
  
  static defaultInset: Inset = { top: 0, right: 0, bottom: 0, left: 0 };
  
  static defaultType: TypeSettings = { font: 'Helvetica', alignment: 'left', size: 12, bold: false };
  
  @Output()
  edit = new EventEmitter<void>();
  
  debouncer = new Subject<void>();
  
  settings = input<Settings>();
  
  form = new FormGroup({
    margin: new FormControl<Inset>(SettingsComponent.defaultInset),
    heading: new FormGroup({
      type: new FormControl<TypeSettings>(SettingsComponent.defaultType),
      padding: new FormControl<Inset>(SettingsComponent.defaultInset),
    }),
    columnHeaders: new FormGroup({
      type: new FormControl<TypeSettings>(SettingsComponent.defaultType),
      padding: new FormControl<Inset>(SettingsComponent.defaultInset),
    }),
    rowHeaders: new FormGroup({
      type: new FormControl<TypeSettings>(SettingsComponent.defaultType),
      padding: new FormControl<Inset>(SettingsComponent.defaultInset),
      width: new FormControl<number>(0),
    }),
    cells: new FormGroup({
      padding: new FormControl<Inset>(SettingsComponent.defaultInset),
      spacing: new FormControl<number>(0),
      emptyColor: new FormControl<string>(''),
    }),
    teacher: new FormGroup({
      type: new FormControl<TypeSettings>(SettingsComponent.defaultType),
    }),
    location: new FormGroup({
      type: new FormControl<TypeSettings>(SettingsComponent.defaultType),
    }),
  });
  
  constructor() {
    effect(() => {
      const settings = { ...this.settings() };
      this.form.patchValue(settings);
    })
  }
  
  onChange(): void {
    const settings = this.settings();
    const form = this.form.value;
    
    if (settings && form) {
      settings.margin = { ...settings.margin, ...form.margin };
      settings.heading = {
        type: { ...settings.heading.type, ...form.heading?.type },
        padding: { ...settings.heading.padding, ...form.heading?.padding },
      }
      settings.columnHeaders = {
        type: { ...settings.columnHeaders.type, ...form.columnHeaders?.type },
        padding: { ...settings.columnHeaders.padding, ...form.columnHeaders?.padding },
      };
      settings.rowHeaders = {
        type: { ...settings.rowHeaders.type, ...form.rowHeaders?.type },
        padding: { ...settings.rowHeaders.padding, ...form.rowHeaders?.padding },
        width: form.rowHeaders?.width ?? 0,
      };
      settings.cells = {
        padding: { ...settings.cells.padding, ...form.cells?.padding },
        spacing: form.cells?.spacing ?? 0,
        emptyColor: form.cells?.emptyColor ?? '#d9d9d9',
      };
      settings.teacher = {
        type: { ...settings.teacher.type, ...form.teacher?.type },
      };
      settings.location = {
        type: { ...settings.location.type, ...form.location?.type },
      };
      this.debouncer.next();
    }
  }
  
  ngOnInit(): void {


    this.debouncer.pipe(
      debounceTime(1500),
      tap(() => this.edit.emit()),
    ).subscribe();
  }
  
  ngOnDestroy(): void {
    this.debouncer.complete();
    this.edit.complete();
  }
  
}
