import { Cell } from "./cell.model";

export class Row {

    public name: string;

    public cells: Cell[];

    constructor(
        name?: string,
        cells?: Cell[],
    ) {
        this.name = name ?? '';
        this.cells = cells ?? [];
    }

}