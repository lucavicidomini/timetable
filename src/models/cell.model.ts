export class Cell {

    public name: string;

    public rowSpan = 1;

    constructor(
        name?: string,
    ) {
        this.name = name ?? '';
    }

}