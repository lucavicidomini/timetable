import { Component, EventEmitter, input, Output } from '@angular/core';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-page-selector',
  imports: [],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.scss'
})
export class PageSelectorComponent {

  public pages = input<Page[]>([]);

  public selectedPage = input<Page>();

  public showModal = false;

  @Output()
  public addPage = new EventEmitter<void>();

  @Output()
  public deletePage = new EventEmitter<Page>();

  @Output()
  public selectPage = new EventEmitter<number>();

  public onAdd(): void {
    this.addPage.emit();
  }

  public onDelete(page: Page): void {
    this.showModal = false;
    this.deletePage.emit(page);
  }

  public onSelect(v: Event) {
    const el = v.target as HTMLSelectElement;
    this.selectPage.emit(parseInt(el.value));
  }

}
