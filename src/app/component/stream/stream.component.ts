import { Injectable } from '@angular/core';
import { Logger } from '../../entity/service/logger';
import { Cursor } from '../../entity/model/cursor';
import { Location } from '@angular/common';


export interface StreamProvider<T> {
    fetchBottom(
        cursor: Cursor, n: number, includeEqual: boolean): Promise<Array<T>>;
    fetchTop(
        cursor: Cursor, n: number, includeEqual: boolean): Promise<Array<T>>;
}


export interface StreamCursorStoreInfo {
    bottomCursor: Cursor;
    topCursor: Cursor;
    n: number;
    scrollTop: number;
}

@Injectable({
    providedIn: 'root'
})
export class StreamCursorStoreService {

    private store: Map<string, StreamCursorStoreInfo>;

    constructor() {
        this.store = new Map<string, StreamCursorStoreInfo>();
    }

    save(p: string, bottomCursor: Cursor, topCursor: Cursor, n: number, scrollTop: number): void {
        console.log(`Save cursor: ${p}, ${bottomCursor.toString()}, ${topCursor.toString()}, ${n}, ${scrollTop}`);
        this.store.set(p, { bottomCursor, topCursor, n, scrollTop });
    }

    load(p: string): StreamCursorStoreInfo | null {
        const i = this.store.get(p);
        if (!i) {
            return null;
        }
        console.log(`Load cursor: ${p}, ${i.bottomCursor.toString()}, ${i.topCursor.toString()}, ${i.n}, ${i.scrollTop}`);
        return i;
    }

    delete(p: string): void {
        this.store.delete(p);
    }

    get(p: string): StreamCursorStoreInfo | undefined {
        return this.store.get(p);
    }
}


export function generateCallbackIntersectionObserverDefault(
    bottom: {
        el: HTMLElement,
        on: () => Promise<void>,
    },
    top: {
        el: HTMLElement,
        on: () => Promise<void>,
    },
    millisecondsEdgeDetecterInit: number,
    logger: Logger,
): (entities: Array<IntersectionObserverEntry>) => void {
    function a(entries: Array<IntersectionObserverEntry>): void {
        const now = Date.now();
        for (const entry of entries) {
            if (now - millisecondsEdgeDetecterInit <= 1000) {
                continue;
            }
            if (entry.target === bottom.el && entry.isIntersecting) {
                logger.info(`${entry.target.id} ${entry.isIntersecting}`);
                console.log(`onBottom: `, entry);
                bottom.on();
            }
            if (entry.target === top.el && entry.isIntersecting) {
                logger.info(`${entry.target.id} ${entry.isIntersecting}`);
                console.log(`onTop   : `, entry);
                top.on();
            }
        }
    }
    return a;
}

export interface StreamComponentOption {
    waitTimeMilliSeconds: number;
    fetchLength: number;
    maxLength: number;
    threshold: number;
}

export interface StreamComponentLoadOption {
    initCursor: Cursor;
    initScrollBottom: boolean;
    initMethod: 'fetchBottom' | 'fetchTop';
}

export class StreamComponent<T> {

    public datas: Array<T>;
    public dupChecker: Map<string, boolean>;

    private observerScrollingVisibility: IntersectionObserver | null;

    private internalElParent: HTMLElement | null;
    private internalElBottom: HTMLElement | null;
    private internalElTop: HTMLElement | null;

    public isLoading: boolean;

    constructor(
        private llogger: Logger,
        private cursorGetter: (v: T) => Cursor,
        public key: (v: T) => string,
        private streamProvider: StreamProvider<T>,
        private streamCursorStore: StreamCursorStoreService,
        public opt: StreamComponentOption,
        public callbackIntersectionObserverGenerator: (
            bottom: {
                el: HTMLElement,
                on: () => Promise<void>,
            },
            top: {
                el: HTMLElement,
                on: () => Promise<void>,
            },
            millisecondsEdgeDetecterInit: number,
            l: Logger,
        ) =>
            (entities: Array<IntersectionObserverEntry>) => void = generateCallbackIntersectionObserverDefault,
    ) {
        this.datas = [];
        this.dupChecker = new Map<string, boolean>();
        this.observerScrollingVisibility = null;
        this.internalElBottom = null;
        this.internalElTop = null;
        this.internalElParent = null;
        this.isLoading = false;
        if (this.opt.fetchLength >= this.opt.maxLength) {
            throw new Error(`Invalid length: ${this.opt.fetchLength} ${this.opt.maxLength}`);
        }
    }

    initElements(a: {
        elParent: HTMLElement,
        elBottom: HTMLElement,
        elTop: HTMLElement,
    }): void {
        this.internalElParent = a.elParent;
        this.internalElBottom = a.elBottom;
        this.internalElTop = a.elTop;
    }

    save(uniqId: string): void {
        const bottomData = this.bottomData();
        const topData = this.topData();
        if (!bottomData) {
            return;
        }
        if (!topData) {
            return;
        }
        if (!this.internalElParent) {
            return;
        }
        this.streamCursorStore.save(
            uniqId,
            this.cursorGetter(bottomData),
            this.cursorGetter(topData),
            this.datas.length,
            this.internalElParent.scrollTop,
        );
    }

    async load(uniqId: string, loadopt: StreamComponentLoadOption): Promise<void> {
        if (this.isLoading) {
            return;
        }
        const i = this.streamCursorStore.load(uniqId);
        let scrollTop = -1;
        let fetcher: Promise<Array<T>> | null = null;
        this.isLoading = true;
        if (i) {
            fetcher = this.streamProvider.fetchTop(
                i.bottomCursor,
                i.n,
                true,
            );
            scrollTop = i.scrollTop;
        } else {
            if (loadopt.initMethod === 'fetchBottom') {
                fetcher = this.streamProvider.fetchBottom(
                    loadopt.initCursor,
                    this.opt.fetchLength,
                    true,
                );
            } else {
                fetcher = this.streamProvider.fetchTop(
                    loadopt.initCursor,
                    this.opt.fetchLength,
                    true,
                );
            }
        }
        const bottomData = this.bottomData();
        if (!bottomData) {
            return;
        }
        await fetcher
            .then(v => this.addDatasToTop(...v))
            .then(() => {
                if (scrollTop === null) {
                    if (loadopt.initScrollBottom) {
                        if (!this.bottomData()) {
                            return;
                        }
                        this.scrollTo(this.scrollTopAtBottom(this.key(bottomData)));
                        return;
                    }
                    return;
                }
                this.scrollTo(scrollTop);
            })
            .finally(() => {
                this.isLoading = false;
            })
            ;
    }

    getCursorStoreInfo(uniqId: string): StreamCursorStoreInfo | undefined {
        return this.streamCursorStore.get(uniqId);
    }

    async fetchTop(): Promise<void> {
        if (this.isLoading) {
            return;
        }
        const topData = this.topData();
        if (!topData) {
            return;
        }
        this.isLoading = true;
        await this.streamProvider.fetchTop(this.cursorGetter(topData), this.opt.fetchLength, false)
            .then(v => new Promise<Array<T>>(resolve => {
                setTimeout(() => resolve(v), this.opt.waitTimeMilliSeconds);
            }))
            .then(v => this.addDatasToTop(...v))
            .then(v => {
                if (v.length <= 0) {
                    return;
                }
                const topDataBeforeFetch = this.topData();
                if (!topDataBeforeFetch) {
                    return;
                }
                this.scrollTo(this.scrollTopAtTop(this.key(topDataBeforeFetch)));
            })
            .then(() => new Promise(resolve => {
                setTimeout(resolve, this.opt.waitTimeMilliSeconds);
            }))
            .finally(() => {
                this.isLoading = false;
                this.llogger.info('isLoading to false');
            });
    }

    async fetchBottom(): Promise<void> {
        if (this.isLoading) {
            return;
        }
        const bottomData = this.bottomData();
        if (!bottomData) {
            return;
        }
        this.isLoading = true;
        await this.streamProvider.fetchBottom(this.cursorGetter(bottomData), this.opt.fetchLength, false)
            .then(v => new Promise<Array<T>>(resolve => {
                setTimeout(() => resolve(v), this.opt.waitTimeMilliSeconds);
            }))
            .then(v => this.addDatasToBottom(...v))
            .then(v => {
                if (v.length <= 0) {
                    return;
                }
                const bottomDataBeforeFetch = this.bottomData();
                if (!bottomDataBeforeFetch) {
                    return;
                }
                this.scrollTo(this.scrollTopAtBottom(this.key(bottomDataBeforeFetch)));
            })
            .then(() => new Promise(resolve => {
                setTimeout(resolve, this.opt.waitTimeMilliSeconds);
            }))
            .finally(() => {
                this.isLoading = false;
                this.llogger.info('isLoading to false');
            });
    }

    onDestroy(): void {
        this.destroyEdgeDetector();
    }

    initEdgeDetector(): void {
        if (this.observerScrollingVisibility) {
            return;
        }
        if (!this.internalElBottom || !this.internalElTop) {
            return;
        }
        this.observerScrollingVisibility = new IntersectionObserver(
            this.callbackIntersectionObserverGenerator(
                {
                    el: this.internalElBottom,
                    on: () => this.onBottom(),
                },
                {
                    el: this.internalElTop,
                    on: () => this.onTop(),
                },
                Date.now(),
                this.llogger,
            ),
            {
                root: this.internalElParent,
                rootMargin: '0px',
                threshold: this.opt.threshold,
            },
        );
        if (this.internalElBottom) {
            this.observerScrollingVisibility.observe(this.internalElBottom);
        }
        if (this.internalElTop) {
            this.observerScrollingVisibility.observe(this.internalElTop);
        }
    }

    destroyEdgeDetector(): void {
        if (this.observerScrollingVisibility) {
            this.observerScrollingVisibility.disconnect();
            this.observerScrollingVisibility = null;
        }
    }

    public isUpdated(): boolean {
        if (!this.internalElParent) {
            return true;
        }
        const d: HTMLElement = this.internalElParent;
        // this.llogger.info(`- ${d}, ${this.dupChecker.size}, ${d.children.length}`);
        let count = 0;
        for (let i = 0; i < d.children.length; i++) {
            const item = d.children.item(i);
            if (!item) {
                continue;
            }
            if (item.getAttribute('key')) {
                count++;
            }
        }
        if (count !== this.dupChecker.size) {
            return false;
        }
        for (const keyString of Array.from(this.dupChecker.keys())) {
            let ok = false;
            for (let i = 0; i < d.children.length; i++) {
                const child = d.children.item(i);
                if (!child) {
                    continue;
                }
                const attrKeyString = child.getAttribute('key');
                if (attrKeyString === keyString) {
                    ok = true;
                    break;
                }
            }
            // this.llogger.info((this.eel.nativeElement as HTMLElement).lastElementChild.getAttribute('cursor'));
            if (!ok) {
                // this.llogger.info(`b false`);
                return false;
            }
        }
        // this.llogger.info(`c ${(this.bottomData() as any).createdAt}`);
        return true;
    }

    private filterDuplicate(...items: Array<T>): Array<T> {
        const added: Array<T> = [];
        for (const v of items) {
            if (this.dupChecker.has(this.key(v))) {
                continue;
            }
            added.push(v);
        }
        return added;
    }

    private addDuplicate(...itemKeys: Array<string>): void {
        for (const v of itemKeys) {
            this.dupChecker.set(v, true);
        }
    }

    private removeDuplicate(...itemKeys: Array<string>): void {
        for (const v of itemKeys) {
            this.dupChecker.delete(v);
        }
    }

    async addDatasToBottom(...items: Array<T>): Promise<Array<T>> {
        if (items.length <= 0) {
            return Promise.resolve([]);
        }
        const added = this.filterDuplicate(...items);
        if (added.length <= 0) {
            return [];
        }
        return new Promise<Array<T>>((resolve, reject) => {
            if (!this.internalElParent) {
                resolve();
                return;
            }
            const observer = new MutationObserver((mutations: Array<MutationRecord>) => {
                // this.llogger.info(...mutations.map(v => ` ${v.addedNodes.length}:${v.removedNodes.length}`));
                if (!this.isUpdated()) {
                    return;
                }
                this.llogger.info('Updated');
                observer.disconnect();
                resolve(added);
            });
            observer.observe(this.internalElParent, { childList: true });
            this.datas.push(...added);
            this.addDuplicate(...added.map(v => this.key(v)));
            if (this.datas.length > this.opt.maxLength) {
                for (let i = 0; i < this.datas.length - this.opt.maxLength; i++) {
                    const shifted = this.datas.shift();
                    if (!shifted) {
                        continue;
                    }
                    this.removeDuplicate(this.key(shifted));
                }
            }
        });
    }

    async addDatasToTop(...items: Array<T>): Promise<Array<T>> {
        if (items.length <= 0) {
            return [];
        }
        const added = this.filterDuplicate(...items);
        if (added.length <= 0) {
            return [];
        }
        return new Promise<Array<T>>((resolve, reject) => {
            if (!this.internalElParent) {
                resolve();
                return;
            }
            const observer = new MutationObserver((mutations: Array<MutationRecord>, _) => {
                // this.llogger.info(...mutations.map(v => ` ${v.addedNodes.length}:${v.removedNodes.length}`));
                if (!this.isUpdated()) {
                    return;
                }
                // this.llogger.info('Updated');
                observer.disconnect();
                resolve(added);
            });
            observer.observe(this.internalElParent, { childList: true });
            this.datas.unshift(...added);
            this.addDuplicate(...added.map(v => this.key(v)));
            if (this.datas.length > this.opt.maxLength) {
                for (let i = 0; i < this.datas.length - this.opt.maxLength; i++) {
                    const poped = this.datas.pop();
                    if (!poped) {
                        continue;
                    }
                    this.removeDuplicate(this.key(poped));
                }
            }
        });
    }

    async clearDatas(): Promise<void> {
        if (this.datas.length <= 0) {
            return;
        }
        return new Promise<void>((resolve, reject) => {
            const elParent = this.internalElParent;
            if (!elParent) {
                resolve();
                return;
            }
            const observer = new MutationObserver((mutations: Array<MutationRecord>, _) => {
                // this.llogger.info(...mutations.map(v => ` ${v.addedNodes.length}:${v.removedNodes.length}`));
                // this.llogger.info(`- ${d}, ${this.dupChecker.size}, ${d.children.length}`);
                let count = 0;
                for (let i = 0; i < elParent.children.length; i++) {
                    const item = elParent.children.item(i);
                    if (!item) {
                        continue;
                    }
                    if (item.getAttribute('key')) {
                        count++;
                    }
                }
                if (count > 0) {
                    return;
                }
                // this.llogger.info('Updated');
                observer.disconnect();
                resolve();
            });
            observer.observe(elParent, { childList: true });
            this.dupChecker.clear();
            this.datas = [];
        });
    }

    topData(): T | null {
        if (this.datas.length <= 0) {
            return null;
        }
        return this.datas[0];
    }

    bottomData(): T | null {
        if (this.datas.length <= 0) {
            return null;
        }
        return this.datas[this.datas.length - 1];
    }

    scrollTopAtTop(targetKey: string): number {
        let s = 0;
        const root = this.internalElParent;
        if (!root) {
            return 0;
        }
        for (let i = 0; i < root.children.length; i++) {
            const e: HTMLElement = root.children.item(i) as HTMLElement;
            const attr = e.attributes.getNamedItem('key');
            if (!attr) {
                continue;
            }
            if (attr.value === targetKey) {
                break;
            }
            s += e.offsetHeight;
        }
        return s;
    }

    scrollTopAtBottom(targetKey: string): number {
        let s = 0;
        const root = this.internalElParent;
        if (!root) {
            return 0;
        }
        for (let i = 0; i < root.children.length; i++) {
            const e: HTMLElement = root.children.item(i) as HTMLElement;
            const attr = e.attributes.getNamedItem('key');
            if (!attr) {
                continue;
            }
            s += e.offsetHeight;
            if (attr.value === targetKey) {
                break;
            }
        }
        s -= root.offsetHeight;
        s += this.heightStreamPaddingTop();
        s += this.heightStreamPaddingBottom();
        return s;
    }

    scrollTo(s: number): void {
        const p = this.internalElParent;
        if (!p) {
            return;
        }
        p.scrollTo({ top: s });
    }

    private heightStreamPaddingBottom(): number {
        const root = this.internalElParent;
        if (!root) {
            return 0;
        }
        let s = 0;
        for (let i = 0; i < root.children.length; i++) {
            const e: HTMLElement = root.children.item(i) as HTMLElement;
            if (e !== this.internalElBottom) {
                continue;
            }
            s += e.offsetHeight;
        }
        return s;
    }

    private heightStreamPaddingTop(): number {
        const root = this.internalElParent;
        if (!root) {
            return 0;
        }
        let s = 0;
        for (let i = 0; i < root.children.length; i++) {
            const e: HTMLElement = root.children.item(i) as HTMLElement;
            if (e !== this.internalElTop) {
                continue;
            }
            s += e.offsetHeight;
        }
        return s;
    }

    async onBottom(): Promise<void> { }
    async onTop(): Promise<void> { }
}
