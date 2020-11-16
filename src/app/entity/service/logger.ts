
export abstract class Logger {
    abstract info(...args: Array<string>): void;
    abstract clear(): void;
}
