
export abstract class Logger {
    abstract info(...args: Array<string>): void;
    abstract clear(): void;
}

export class ConsoleLogger extends Logger {
    constructor() {
        super();
    }

    info(...args: Array<string>): void {
        console.log(...args);
    }

    clear(): void { }
}
