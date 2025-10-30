import { Component, computed, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, tap } from 'rxjs';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-page-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss'
})
export class PageEditorComponent implements OnInit, OnDestroy {

  @Output()
  edit = new EventEmitter<void>();

  debouncer = new Subject<void>();

  page = input<Page>();

  form = computed(() => {
    const page = this.page();
    return page
      ? new FormGroup({
        name: new FormControl(page.name),
        color: new FormControl(page.color),
        columns: new FormArray(page.columns.map(column => new FormGroup({
          name: new FormControl(column.name),
        }))),
        rows: new FormArray(page.rows.map(row => new FormGroup({
          name: new FormControl(row.name),
          cells: new FormArray(row.cells.map(cell => new FormGroup({
            name: new FormControl(cell.name),
          }))),
        }))),
      })
      : null;
  });

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

  getRowSpan(rowNum: number, cellNum: number): number {
    return this.page()?.rows[rowNum].cells[cellNum].rowSpan ?? 1;
  }

  onChange(): void {
    const page = this.page();
    const form = this.form()?.value;

    if (page && form) {
      page.name = (form.name ?? '').trim();
      page.color = form.color ?? Page.DEFAULT_COLOR;
      page.columns = (form.columns ?? []).map(column => ({
        name: column.name ?? '',
      }));
      page.rows = (form.rows ?? []).map((row, rowNum) => ({
        name: (row.name ?? '').trim(),
        cells: (row.cells ?? []).map((cell, cellNum) => ({
          name: cell.name ?? '',
          rowSpan: page.rows[rowNum].cells[cellNum].rowSpan,
        })),
      }));

      this.debouncer.next();
    }
  }

  onCellMerge(rowNum: number, cellNum: number): void {
    const page = this.page();
    if (page && rowNum < page.rows.length - 1) {
      // If merging with another mergen cell, them merge spans
      const cell = page.rows[rowNum].cells[cellNum];
      const nextCell = page.rows[rowNum + cell.rowSpan].cells[cellNum];
      cell.rowSpan += nextCell.rowSpan;
      nextCell.rowSpan = 0;
    }
  }

  onCellSplit(rowNum: number, cellNum: number): void {
    const page = this.page();
    if (page) {
      const rowSpan = page.rows[rowNum].cells[cellNum].rowSpan;
      for (let r = rowNum; r < rowNum + rowSpan; r++) {
        page.rows[r].cells[cellNum].rowSpan = 1;
      }
    }
  }

  getGridStyle(rowCount: number, colCount: number) {
    return {
      gridTemplateColumns: '1fr ' + '2fr '.repeat(colCount),
      gridTemplateRows: 'min-content '.repeat(rowCount + 1),
    }
  }

  getColumnHeaderStyle(colNum: number) {
    return {
      gridColumnStart: colNum + 2,
      gridRowStart: 2,
    }
  }

  getRowHeaderStyle(rowNum: number) {
    return {
      gridColumnStart: 1,
      gridRowStart: rowNum + 3,
    }
  }

  getCellStyle(rowNum: number, colNum: number) {
    const rowSpan = this.page()?.rows[rowNum].cells[colNum].rowSpan ?? 1;
    return {
      gridColumnStart: colNum + 2,
      gridRowStart: rowNum + 3,
      gridRowEnd: rowNum + 3 + rowSpan
    }
  }

}
