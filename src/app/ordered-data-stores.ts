import { Cursor, CursorSorter } from './entity/model/cursor';
import { OrderedDataStore } from './ordered-data-store';

export class OrderedDataStores<T>  {
    private ids: Array<string>;
    constructor(
        private cursorGetter: (v: T) => Cursor,
        private cursorSorter: CursorSorter,
        private keyGetter: (v: T) => string,
        private stores: Map<string, OrderedDataStore<T>> = new Map<string, OrderedDataStore<T>>(),
    ) {
        this.ids = [];
    }

    setId(...ids: Array<string>): void {
        this.ids = ids;
        if (!this.stores.has(this.key)) {
            this.stores.set(
                this.key,
                new OrderedDataStore<T>(
                    this.cursorGetter,
                    this.cursorSorter,
                    this.keyGetter,
                ),
            );
        }
    }

    private get key(): string {
        return this.ids.join('-');
    }

    private getStore(storeId = ''): OrderedDataStore<T> | undefined {
        let store = this.stores.get(this.key);
        if (storeId !== '') {
            store = this.stores.get(storeId);
        }
        if (!store) {
            return undefined;
        }
        return store;
    }

    get size(): number {
        const store = this.getStore(this.key);
        if (!store) {
            return -1;
        }
        return store.size;
    }

    getItem(id: string, storeId: string = ''): T | undefined {
        const store = this.getStore(storeId);
        if (!store) {
            return undefined;
        }
        return store.getByID(id);
    }

    getItemAtRandom(storeId: string = ''): T | undefined {
        const store = this.getStore(storeId);
        if (!store) {
            return undefined;
        }
        return store.getRandom();
    }

    getAll(storeId: string = ''): Array<T> {
        const store = this.getStore(storeId);
        if (!store) {
            return [];
        }
        return store.getAll();
    }

    getLargerN(cursor: Cursor, n: number, includeEqual: boolean = false, storeId: string = ''): Array<T> {
        const store = this.getStore(storeId);
        if (!store) {
            return [];
        }
        return store.getLargerN(cursor, n, includeEqual);
    }

    getSmallerN(cursor: Cursor, n: number, includeEqual: boolean = false, storeId: string = ''): Array<T> {
        const store = this.getStore(storeId);
        if (!store) {
            return [];
        }
        return store.getSmallerN(cursor, n, includeEqual);
    }

    public add(...args: Array<T>): void {
        const store = this.getStore(this.key);
        if (!store) {
            return;
        }
        store.add(...args);
    }

    toAny(): any {
        const b: any = {};
        for (const key of Array.from(this.stores.keys())) {
            const store = this.getStore(key);
            if (!store) {
                continue;
            }
            const a = store.toAny();
            b[key] = a;
        }
        return b;
    }

    fromAny(a: any): void {
        for (const key1 of Object.keys(a)) {
            const store = a[key1];
            this.setId(key1);
            for (const b of store) {
                this.add(b[1]);
            }
        }
    }
}
