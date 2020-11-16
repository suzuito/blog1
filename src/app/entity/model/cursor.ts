export interface Cursor {
    length: number;
    toString(): string;
    getItem(i: number): number | string;
}

export enum CursorSorterId {
    Asc = 'asc',
    Desc = 'desc',
}

export interface CursorSorter {
    fn: (a: Cursor, b: Cursor) => number;
    id: CursorSorterId;
    toString: () => string;
}

export const cursorSorterAsc: CursorSorter = {
    id: CursorSorterId.Asc,
    fn: (a: Cursor, b: Cursor): number => {
        for (let i = 0; i < a.length; i++) {
            const aa = a.getItem(i);
            const bb = b.getItem(i);
            if (aa < bb) {
                return -1;
            }
            if (aa > bb) {
                return 1;
            }
        }
        return 0;
    },
};

export const cursorSorterDesc: CursorSorter = {
    id: CursorSorterId.Desc,
    fn: (a: Cursor, b: Cursor): number => {
        for (let i = 0; i < a.length; i++) {
            const aa = a.getItem(i);
            const bb = b.getItem(i);
            if (aa < bb) {
                return 1;
            }
            if (aa > bb) {
                return -1;
            }
        }
        return 0;
    },
};



export class Results<T> {
    constructor(public datas: Array<T>) {
        if (!this.datas) {
            this.datas = [];
        }
    }

    get last(): T | null {
        if (this.datas.length <= 0) {
            return null;
        }
        return this.datas[this.datas.length - 1];
    }
}
