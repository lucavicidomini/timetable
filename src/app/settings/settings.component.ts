import { Component, computed, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
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

  @Output()
  edit = new EventEmitter<void>();

  debouncer = new Subject<void>();

  settings = input<Settings>();

  form = computed(() => {
    const settings = this.settings();
    return settings
      ? new FormGroup({
        margin: new FormControl<Inset>(settings.margin),
        heading: new FormGroup({
          type: new FormControl<TypeSettings>(settings.heading.type),
          padding: new FormControl<Inset>(settings.heading.padding),
        }),
        columnHeaders: new FormGroup({
          type: new FormControl<TypeSettings>(settings.columnHeaders.type),
          padding: new FormControl<Inset>(settings.columnHeaders.padding),
        }),
        rowHeaders: new FormGroup({
          type: new FormControl<TypeSettings>(settings.rowHeaders.type),
          padding: new FormControl<Inset>(settings.rowHeaders.padding),
          width: new FormControl<number>(settings.rowHeaders.width),
        }),
        cells: new FormGroup({
          padding: new FormControl<Inset>(settings.cells.padding),
          spacing: new FormControl<number>(settings.cells.spacing),
          emptyColor: new FormControl<string>(settings.cells.emptyColor),
        }),
        teacher: new FormGroup({
          type: new FormControl<TypeSettings>(settings.teacher.type),
        }),
        location: new FormGroup({
          type: new FormControl<TypeSettings>(settings.location.type),
        }),
      })
      : null;
  });

  onChange(): void {
    const settings = this.settings();
    const form = this.form()?.value;

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
