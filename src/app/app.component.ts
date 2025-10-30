import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppState } from '../models/app-state.model';
import { Page } from '../models/page.model';
import { AppStateService } from '../services/app-state.service';
import { PdfService } from '../services/pdf.service';
import { PageEditorComponent } from "./page-editor/page-editor.component";
import { PageSelectorComponent } from "./page-selector/page-selector.component";
import { SettingsComponent } from "./settings/settings.component";
import { PreviewComponent } from "./preview/preview.component";

@Component({
  selector: 'app-root',
  imports: [PageSelectorComponent, PageEditorComponent, SettingsComponent, PreviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private appStateService = inject(AppStateService);

  private pdfService = inject(PdfService);

  appState = signal<AppState>(new AppState());

  pages = computed(() => this.appState().pages);

  settings = computed(() => this.appState().settings);

  url = computed(() => this.pdfService.preview(this.appState()))

  showSettings = true;

  showPreview = false;

  selectedPageNum = signal<number | undefined>(undefined);

  selectedPage = computed(() => {
    const selectedPageNum = this.selectedPageNum();
    if (selectedPageNum !== undefined) {
      return this.pages()[selectedPageNum]
    }
    return undefined;
  });

  public ngOnInit(): void {
    const fromStorage = this.appStateService.load();
    if (fromStorage) {
      this.appState.set(fromStorage);
      this.onSelectPage(0);
    } else  {
      this.onAddPage();
    }
  }

  public onAddPage(): void {
    const page = new Page();
    this.pages().push(page);
    this.onSelectPage(this.pages().length - 1);
  }

  public onDeletePage(toDelete: Page): void {
    const index = this.pages().findIndex(page => toDelete === page);
    this.pages().splice(index, 1);
  }

  public onDownload(): void {
    this.appStateService.download(this.appState(), 'Orario.json');
  }

  public onEdit(): void {
    const appState = this.appState();
    this.appStateService.store(appState);
    this.appState.update(() => new AppState(appState));
  }

  public onPdf(): void {
    this.pdfService.download(this.appState());
  }

  public onSelectPage(pageNum: number) {
    this.selectedPageNum.set(pageNum);
  }

}
