export interface TypeSettings {
    font: string;
    size: number;
    bold: boolean;
    alignment: string;
}

export interface Inset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface Settings {
    margin: Inset,
    heading: {
        type: TypeSettings,
        padding: Inset,
    },
    columnHeaders: {
        type: TypeSettings,
        padding: Inset,
    },
    rowHeaders: {
        type: TypeSettings,
        padding: Inset,
        width: number,
    },
    cells: {
        padding: Inset,
        spacing: number,
        emptyColor: string,
    }
    teacher: {
        type: TypeSettings,
    },
    location: {
        type: TypeSettings,
    },
}