import { Column } from "./column.model";
import { Page } from "./page.model";
import { Row } from "./row.model";
import { Inset, Settings, TypeSettings } from "./settings.model";

export class AppState {
    settings: Settings;
    pages: Page[];

    constructor(source?: Partial<AppState>) {
        const defaultType: TypeSettings = {
            font: '',
            size: 12,
            bold: true,
            alignment: 'center',
        };
        const noInset: Inset = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
        }
        this.settings = {
            margin: this.mergeInset(source?.settings?.margin, { top: 15, right: 15, bottom: 15, left: 15 }),
            heading: {
                type: this.mergeType(source?.settings?.heading.type, defaultType),
                padding: this.mergeInset(source?.settings?.heading.padding, noInset),
            },
            columnHeaders: {
                type: this.mergeType(source?.settings?.columnHeaders.type, defaultType),
                padding: this.mergeInset(source?.settings?.columnHeaders.padding, noInset),
            },
            rowHeaders: {
                type: this.mergeType(source?.settings?.rowHeaders.type, defaultType),
                padding: this.mergeInset(source?.settings?.rowHeaders.padding, noInset),
                width: 1 * (source?.settings?.rowHeaders.width ?? 15),
            },
            cells: {
                padding: this.mergeInset(source?.settings?.cells.padding, noInset),
                spacing: 1 * (source?.settings?.cells.spacing ?? 6),
                emptyColor: (source?.settings?.cells.emptyColor ?? '#d9d9d9'),
            },
            teacher: {
                type: this.mergeType(source?.settings?.teacher.type, defaultType),
            },
            location: {
                type: this.mergeType(source?.settings?.location.type, defaultType),
            },
        };
        this.pages = (source?.pages ?? []).map(sourcePage => {
            const page = new Page(sourcePage.name, sourcePage.color);
            page.columns = (sourcePage.columns ?? []).map(sourceCol => new Column(sourceCol.name));
            page.rows = (sourcePage.rows ?? []).map(sourceRow => new Row(sourceRow.name, sourceRow.cells));
            return page;
        });
    }

    private mergeInset(source: Partial<Inset> | undefined, defaults: Inset): Inset {
        return {
            bottom: source?.bottom ?? defaults.bottom,
            left: source?.left ?? defaults.left,
            right: source?.right ?? defaults.right,
            top: source?.top ?? defaults.top,
        }
    }

    private mergeType(source: Partial<TypeSettings> | undefined, defaults: TypeSettings): TypeSettings {
        return {
            font: source?.font ?? defaults.font,
            size: source?.size ?? defaults.size,
            bold: source?.bold ?? defaults.bold,
            alignment: source?.alignment ?? defaults.alignment,
        }
    }
}