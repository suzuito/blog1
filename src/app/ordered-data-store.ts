import { Cursor, CursorSorter, cursorSorterAsc, cursorSorterDesc } from './entity/model/cursor';

export class OrderedDataStore<T> {
    private datas: Map<string, T>;
    private cursors: Array<Cursor>;
    private idToCursorString: Map<string, string>;

    constructor(
        private cursorGetter: (v: T) => Cursor,
        public cursorSorter: CursorSorter,
        private identifier: (v: T) => string,
    ) {
        this.datas = new Map<string, T>();
        this.cursors = [];
        this.idToCursorString = new Map<string, string>();
    }

    add(...args: Array<T>): void {
        const added: Array<T> = [];
        args.forEach(v => {
            if (!v) {
                return;
            }
            if (added.find(vv => this.cursorGetter(vv).toString() === this.cursorGetter(v).toString())) {
                return;
            }
            if (this.datas.has(this.cursorGetter(v).toString())) {
                return;
            }
            added.push(v);
        });
        added.forEach(v => {
            const cursor = this.cursorGetter(v);
            this.cursors.push(cursor);
            this.datas.set(cursor.toString(), v);
            this.idToCursorString.set(this.identifier(v), cursor.toString());
        });
        this.cursors.sort(this.cursorSorter.fn);
    }

    getAll(): Array<T> {
        const r: Array<T> = [];
        if (this.cursorSorter === cursorSorterAsc) {
            for (const c of this.cursors) {
                const data = this.datas.get(c.toString());
                if (!data) {
                    continue;
                }
                r.push(data);
            }
        } else {
            for (let i = this.cursors.length - 1; i >= 0; i--) {
                const c = this.cursors[i];
                const data = this.datas.get(c.toString());
                if (!data) {
                    continue;
                }
                r.push(data);
            }
        }
        return r;
    }

    getLargerN(cursor: Cursor, n: number, includeEqual: boolean = false): Array<T> {
        if (this.cursorSorter === cursorSorterAsc) {
            let j = 0;
            let i = 0;
            const ret: Array<T> = [];
            for (; i < this.cursors.length; i++) {
                const c = this.cursors[i];
                const r = this.cursorSorter.fn(c, cursor);
                if (
                    (r >= 1 && !includeEqual) ||
                    (r >= 0 && includeEqual)
                ) {
                    j++;
                    const data = this.datas.get(c.toString());
                    if (!data) {
                        continue;
                    }
                    ret.push(data);
                    if (j >= n) {
                        break;
                    }
                }
            }
            return ret;
        } else {
            let j = 0;
            let i = this.cursors.length - 1;
            const ret: Array<T> = [];
            for (; i >= 0; i--) {
                const c = this.cursors[i];
                const r = this.cursorSorter.fn(c, cursor);
                if (
                    (r <= -1 && !includeEqual) ||
                    (r <= 0 && includeEqual)
                ) {
                    j++;
                    const data = this.datas.get(c.toString());
                    if (!data) {
                        continue;
                    }
                    ret.unshift(data);
                    if (j >= n) {
                        break;
                    }
                }
            }
            return ret;
        }
        return [];
    }

    getSmallerN(cursor: Cursor, n: number, includeEqual: boolean = false): Array<T> {
        if (this.cursorSorter === cursorSorterAsc) {
            let j = 0;
            let i = this.cursors.length - 1;
            const ret = [];
            for (; i >= 0; i--) {
                const c = this.cursors[i];
                const r = this.cursorSorter.fn(c, cursor);
                if (
                    (r <= -1 && !includeEqual) ||
                    (r <= 0 && includeEqual)
                ) {
                    j++;
                    const data = this.datas.get(c.toString());
                    if (!data) {
                        continue;
                    }
                    ret.unshift(data);
                    if (j >= n) {
                        break;
                    }
                }
            }
            return ret;
        } else {
            let j = 0;
            let i = 0;
            const ret = [];
            for (; i < this.cursors.length; i++) {
                const c = this.cursors[i];
                const r = this.cursorSorter.fn(c, cursor);
                if (
                    (r >= 1 && !includeEqual) ||
                    (r >= 0 && includeEqual)
                ) {
                    j++;
                    const data = this.datas.get(c.toString());
                    if (!data) {
                        continue;
                    }
                    ret.push(data);
                    if (j >= n) {
                        break;
                    }
                }
            }
            return ret;
        }
        return [];
    }

    filter(cb: (e: T, i: number) => boolean): Array<T | undefined> {
        return this.cursors
            .map(
                (cursor: Cursor) => {
                    const data = this.datas.get(cursor.toString());
                    if (!data) {
                        return undefined;
                    }
                    return data;
                },
            )
            .filter(
                (data: T | undefined, j: number): boolean => {
                    if (!data) {
                        return false;
                    }
                    return cb(data, j);
                },
            )
            ;
    }

    get(c: Cursor): T | undefined {
        return this.datas.get(c.toString());
    }

    getByID(id: string): T | undefined {
        const cursorString = this.idToCursorString.get(id);
        if (!cursorString) {
            return undefined;
        }
        const v = this.datas.get(cursorString);
        if (!v) {
            return undefined;
        }
        return v;
    }

    getRandom(): T | undefined {
        function getRandomInt(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        }
        const i = getRandomInt(0, 10000000);
        const j = i % this.cursors.length;
        const cursor = this.cursors[j];
        return this.get(cursor);
    }

    get size(): number {
        return this.datas.size;
    }

    toAny(): any {
        const arr = [];
        for (const k of Array.from(this.datas.keys())) {
            const v = this.datas.get(k);
            if (!v) {
                continue;
            }
            arr.push([this.identifier(v), v]);
        }
        return arr;
    }
}