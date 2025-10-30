export class Entry {

    constructor(
        public line1: string,
        public line2: string,
    ) {}

    static fromText(txt: string) {
        const [line1, line2] = txt.split('\n');
        return new Entry(line1, line2);
    }

}