import type Logger from "../../src/Cli/Logger.js";
import type { LogEntry, LogLevel } from "../../src/Types/LoggerTypes.js";
import type { Verbosity } from "../../src/Types/ReportTypes.js";

export interface VerbosityCase {
    readonly verbosity: Verbosity;
    readonly enabled: readonly LogLevel[];
}

export interface CapturedLogger {
    readonly logger: Logger;
    readonly entries: LogEntry[];
}
