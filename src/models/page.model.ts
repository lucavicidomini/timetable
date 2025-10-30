import { Cell } from "./cell.model";
import { Column } from "./column.model";
import { Row } from "./row.model";

export class Page {

    static DEFAULT_ROWS = 5;

    static DEFAULT_COLS = 5;

    static DEFAULT_COLOR = '#accfe5';

    public color: string;

    public name: string;

    public columns: Column[];

    public rows: Row[];

    public constructor(
        name?: string,
        color?: string,
    ) {
        this.name = name ?? 'Nuova pagina';
        this.color = color ?? Page.DEFAULT_COLOR;
        this.columns = Array.from({ length: Page.DEFAULT_COLS }).map(() => new Column());
        this.rows = Array.from({ length: Page.DEFAULT_ROWS }).map(() => new Row(undefined, this.columns.map(() => new Cell())));
    }

}