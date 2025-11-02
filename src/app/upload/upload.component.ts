import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppState } from '../../models/app-state.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  show = input<boolean>();

  @Output()
  hide = new EventEmitter<void>();

  @Output()
  upload = new EventEmitter<AppState>();

  appStateService = inject(AppStateService);

  error: string | null = null;

  form = new FormGroup({
    appState: new FormControl<string>('', [Validators.required]),
  });

  onAccept() {
    const json = this.form.value.appState;
    const newAppState = json ? this.appStateService.parse(json) : null;
    if (newAppState) {
      this.error = null;
      this.upload.emit(newAppState);
    } else {
      this.error = 'Il file non è in formato valido!';
    }
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.error = null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.form.patchValue({ appState: reader.result as string });
      reader.onerror = () => this.error = 'Impossibile leggere il file usando il browser. Prova a copiarne il contenuto e a incollarlo nella casella di testo.';
      reader.readAsText(file);
    }
  }

}
