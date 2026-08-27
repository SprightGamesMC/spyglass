export type LogLevel = "error" | "summary" | "verbose" | "debug";

export interface LogEntry {
    readonly level: LogLevel;
    readonly message: string;
}

export interface LogSink {
    write(entry: LogEntry): void;
}

export interface ProgressLogger {
    debug(message: string): void;
}

export interface NoticeLogger {
    summary(message: string): void;
}
