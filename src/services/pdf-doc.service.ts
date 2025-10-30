import jsPDF, { TextOptionsLight } from "jspdf";
import { Cell } from "../models//cell.model";
import { Page } from "../models//page.model";
import { Inset, TypeSettings } from "../models//settings.model";
import { AppState } from "../models/app-state.model";
import { Entry } from "../models/entry.model";

export class PdfDoc {
    
    public readonly doc: jsPDF;

    protected width = 210;

    protected height = 297;

    protected y = 0;

    protected colWidths: number[] = [];

    protected rowHeights: number[] = [];

    protected headingHeight = 0;

    protected columnHeaderHeight = 0;

    protected entryTeacherHeight = 0;

    protected entryLocationHeight = 0;

    protected page!: Page;

    constructor(
        protected fofo: AppState
    ) {
        this.doc = new jsPDF({
            unit: 'mm',
            format: 'A4',
        });

        this.setType(this.fofo.settings.heading.type);
        this.headingHeight = this.doc.getTextDimensions('Ap').h;

        this.setType(this.fofo.settings.columnHeaders.type);
        this.columnHeaderHeight = this.headingHeight = this.doc.getTextDimensions('Ap').h;

        this.setType(this.fofo.settings.teacher.type);
        this.entryTeacherHeight = this.doc.getTextDimensions('Ap').h + this.doc.getLineHeightFactor() / 2;

        this.setType(this.fofo.settings.location.type);
        this.entryLocationHeight = this.doc.getTextDimensions('Ap').h + this.doc.getLineHeightFactor() / 2;

        this.fofo.pages.forEach((page, pageNum) => this.renderPage(page, pageNum + 1));
    }

    protected renderPage(page: Page, pageNum: number) {
        this.setPage(page, pageNum);
        this.renderHeading();
        this.renderColumnHeaders();
        this.renderTable();
    }

    protected renderHeading() {
        const heading = this.page.name;
        const x = this.getCenterX();
        const y = this.getY(0);
        const options: TextOptionsLight = {
            maxWidth: this.getWidth(),
            align: 'center',
            // horizontalScale: .5
        }
        this.setType(this.fofo.settings.heading.type);
        this.doc.text(heading, x, y, options);
        this.y += this.headingHeight;
    }

    protected renderColumnHeaders() {
        this.setType(this.fofo.settings.columnHeaders.type);
        const headers = this.page.columns.map(col => col.name);
        const p = this.fofo.settings.columnHeaders.padding;
        const h = this.measure(headers).maxH + p.top + p.bottom;

        let x = this.getX(this.fofo.settings.rowHeaders.width);
        
        headers.forEach((header, colNum) => {
            const w = this.colWidths[colNum];
            this.renderTextCell(header, x, this.y, w, h, p, this.page.color);
            x += w;
        })

        this.y += h;
    }

    protected getSpannedCellHeight(rowNum: number, cellNum: number, rowSpan: number) {
        let h = 0;
        for (let s = 0; s < rowSpan; s++) {
            h += this.rowHeights[rowNum + s];
        }
        return h;
    }

    protected renderTable() {
        this.page.rows.forEach((row, rowNum) => {
            // Row header
            let x = this.getX(0);
            const headerH = this.rowHeights[rowNum];
            const headerW = this.fofo.settings.rowHeaders.width;
            const headerP = this.fofo.settings.rowHeaders.padding;
            this.setType(this.fofo.settings.rowHeaders.type);
            this.renderTextCell(row.name, x, this.y, headerW, headerH, headerP, this.page.color);
            x += headerW;

            // Row cells
            row.cells.forEach((cell, cellNum) => {
                const cellW = this.colWidths[cellNum];
                if (cell.rowSpan === 0) {
                    x += cellW;
                    return;
                }
                const cellH = this.getSpannedCellHeight(rowNum, cellNum, cell.rowSpan);
                const cellP = this.fofo.settings.cells.padding;
                const color = cell.name ? undefined : this.fofo.settings.cells.emptyColor;
                this.renderTextCell(cell, x, this.y, cellW, cellH, cellP, color);
                x += cellW;
            });

            // Next row
            this.y += headerH;
        });
    }

    protected renderTextCell(
        content: string | Cell,
        x: number,
        y: number,
        w: number,
        h: number,
        padding?: Inset,
        color?: string,
    ) {
        const isSimple = typeof content === 'string';
        const txtP: Inset = {
            top: padding?.top ?? 0,
            right: padding?.right ?? 0,
            bottom: padding?.bottom ?? 0,
            left: padding?.left ?? 0,
        }
        // Space between two lines
        const txtLineSpace = this.doc.getLineHeightFactor() / 2;
        
        // Cell width and height, minus padding
        const txtCellW = w - txtP.left - txtP.right;
        const txtCellH = h - txtP.top - txtP.bottom;
        if (color) {
            this.doc.setFillColor(color);
        }
        this.doc.rect(x, y, w, h, color ? 'FD' : undefined);
        if (isSimple) {
            // Height of multiline txt
            const txtBlockH = this.doc.getTextDimensions(content, { maxWidth: w }).h;
            // Text starting coordinates
            const txtX = x + txtP.left + txtCellW / 2;
            const txtY = y + txtP.top + this.columnHeaderHeight + (txtCellH - txtBlockH) / 2 - txtLineSpace;
            this.doc.text(content, txtX, txtY, { align: 'center', maxWidth: w });
        } else {
            // Height of cell
            const txtBlockH = this.measureCellHeight(content);
            // Text starting coordinates
            const txtX = x + txtP.left;
            const txtY = y + txtP.top + this.entryTeacherHeight + (txtCellH - txtBlockH) / 2 - txtLineSpace;
            this.renderEntries(this.getCellEntries(content), txtX, txtY, txtCellW);
        }
    }

    protected renderEntries(
        content: Entry[],
        txtX: number,
        txtY: number,
        colWidth: number,
    ) {
        content.forEach(entry => {
            this.setType(this.fofo.settings.teacher.type);
            this.renderText(entry.line1, txtX, txtY, 'center', colWidth);
            txtY += this.entryTeacherHeight;
            this.setType(this.fofo.settings.location.type);
            this.renderText(entry.line2, txtX, txtY, 'center', colWidth);
            txtY += this.entryLocationHeight + this.fofo.settings.cells.spacing;
        });
    }

    renderText(
        txt: string,
        x: number,
        y: number,
        align: 'center' | 'left',
        maxW: number
    ) {
        const txtW = this.doc.getTextDimensions(txt).w;
        const horizontalScale = (maxW && txtW > maxW) ? maxW / txtW : 1;
        const scaledW = txtW * horizontalScale;
        x += (maxW + txtW - scaledW) * .5;
        this.doc.text(txt ?? '', x, y, { align, horizontalScale });
    }

    protected setPage(page: Page, pageNum: number) {
        while (this.doc.getNumberOfPages() < pageNum) {
            this.doc.addPage();
        }
        this.doc.setPage(pageNum);
        this.page = page;
        this.width = 210;
        this.height = 297;
        this.y = this.getY(0);
        this.colWidths = this.calcColWidths();
        this.rowHeights = this.calcRowHeights();
    }

    protected setType(type: TypeSettings) {
        this.doc.setFont('helvetica', type.bold ? 'bold' : 'normal');
        this.doc.setFontSize(type.size);
    }

    protected measure(txts: string[]) {
        let minW = Number.MAX_VALUE;
        let maxW = 0;
        let minH = Number.MAX_VALUE;
        let maxH = 0;
        txts.forEach(txt => {
            const txtLines = 1 // txt.split('\n').length;
            const dim = this.doc.getTextDimensions(txt);
            minW = Math.min(minW, dim.w);
            maxW = Math.max(maxW, dim.w);
            minH = Math.min(minH, dim.h * txtLines);
            maxH = Math.max(maxH, dim.h * txtLines);
        });
        return { minW, maxW, minH, maxH };
    }

    protected measureRowHeaderHeight(rowNum: number): number {
        this.setType(this.fofo.settings.rowHeaders.type)
        const maxWidth = this.fofo.settings.rowHeaders.width - this.fofo.settings.rowHeaders.padding.left - this.fofo.settings.rowHeaders.padding.right;
        return this.doc.getTextDimensions(this.page.rows[rowNum].name, { maxWidth }).h;
    }

    protected measureCellHeight(cell: Cell): number {
        const entries = this.getCellEntries(cell);
        if (!entries.length) {
            return 0;
        }
        const entryHeight = this.entryTeacherHeight + this.entryLocationHeight;
        const entriesHeight = entryHeight * entries.length;
        const entriesSpacing = this.fofo.settings.cells.spacing * (entries.length - 1)
        const padding = 0;
        return entriesHeight + entriesSpacing + padding;
    }

    protected calcColWidths(): number[] {
        const headersWidth = this.fofo.settings.rowHeaders.width;
        const remainderWidth = this.getWidth() - headersWidth;
        const colWidth = remainderWidth / this.page.columns.length;
        const colWidths = Array.from({ length: this.page.columns.length }, () => colWidth);
        return colWidths;
    }

    protected calcRowHeights(): number[] {
        const cellPadding = this.fofo.settings.cells.padding.top + this.fofo.settings.cells.padding.bottom;
        const headerPadding = this.fofo.settings.rowHeaders.padding.top + this.fofo.settings.rowHeaders.padding.bottom;
        let heights = this.page.rows.map((row, rowNum) => {
            const maxRowHeight = row.cells.reduce(
                (carry, cell) => cell.rowSpan === 1
                    ? Math.max(carry, cellPadding + this.measureCellHeight(cell))
                    : carry,
                headerPadding + this.measureRowHeaderHeight(rowNum)
            );
            return maxRowHeight;
        });
        const availableHeight = this.getHeight() - this.headingHeight;
        const calculatedHeight = heights.reduce((carry, height) => carry + height, 0);
        const scalingFactor = availableHeight / calculatedHeight;
        if (scalingFactor > 1) {
            heights = heights.map(height => height * scalingFactor);
        }
        return heights;
    }

    protected getCellEntries(cell: Cell): Entry[] {
        return cell.name.split('\n\n')
            .filter(txt => !!txt)
            .map(txt => Entry.fromText(txt));
    }

    protected getCenterX(): number {
        return this.width / 2;
    }

    protected getWidth(): number {
        return this.width - this.fofo.settings.margin.left - this.fofo.settings.margin.right;
    }

    protected getHeight(): number {
        return this.height - this.fofo.settings.margin.top - this.fofo.settings.margin.bottom;
    }

    protected getX(x: number): number {
        return x + this.fofo.settings.margin.left;
    }

    protected getY(y: number): number {
        return y + this.fofo.settings.margin.top;
    }
}