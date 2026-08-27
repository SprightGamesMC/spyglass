import type { LogEntry, LogLevel, LogSink } from "../Types/LoggerTypes.js";
import type { Verbosity } from "../Types/ReportTypes.js";

export default class Logger {
    static readonly VERBOSITY_LEVELS: Readonly<Record<Verbosity, LogLevel | undefined>> = {
        silent: undefined,
        summary: "summary",
        normal: "summary",
        verbose: "verbose",
        debug: "debug",
    };
    private static readonly LEVEL_ORDER: readonly LogLevel[] = ["error", "summary", "verbose", "debug"];
    private static readonly PREFIXED_LEVELS: readonly LogLevel[] = ["verbose", "debug"];

    private readonly sinks: readonly LogSink[];
    private readonly threshold: LogLevel | undefined;

    static forVerbosity(verbosity: Verbosity, write: (text: string) => void): Logger {
        return new Logger(Logger.VERBOSITY_LEVELS[verbosity], [{ write: (entry): void => write(Logger.format(entry)) }]);
    }

    static format(entry: LogEntry): string {
        if (Logger.PREFIXED_LEVELS.includes(entry.level)) {
            return entry.level + ": " + entry.message + "\n";
        }

        return entry.message + "\n";
    }

    constructor(threshold: LogLevel | undefined, sinks: readonly LogSink[] = []) {
        this.threshold = threshold;
        this.sinks = [...sinks];
    }

    log(level: LogLevel, message: string): void {
        if (!this.isEnabled(level)) {
            return;
        }

        const entry: LogEntry = { level, message };

        for (const sink of this.sinks) {
            sink.write(entry);
        }
    }

    error(message: string): void {
        this.log("error", message);
    }

    summary(message: string): void {
        this.log("summary", message);
    }

    verbose(message: string): void {
        this.log("verbose", message);
    }

    debug(message: string): void {
        this.log("debug", message);
    }

    private isEnabled(level: LogLevel): boolean {
        if (this.threshold === undefined) {
            return false;
        }

        return Logger.LEVEL_ORDER.indexOf(level) <= Logger.LEVEL_ORDER.indexOf(this.threshold);
    }
}
