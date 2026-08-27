import type { LogEntry, LogLevel } from "../../src/Types/LoggerTypes.js";
import type { Verbosity } from "../../src/Types/ReportTypes.js";
import type { CapturedLogger, VerbosityCase } from "../Types/LoggerFiltersByVerbosityTypes.js";
import Logger from "../../src/Cli/Logger.js";

export default abstract class LoggerFiltersByVerbosity {
    static readonly LEVELS: readonly LogLevel[] = ["error", "summary", "verbose", "debug"];
    static readonly CASES: readonly VerbosityCase[] = [
        { verbosity: "silent", enabled: [] },
        { verbosity: "summary", enabled: ["error", "summary"] },
        { verbosity: "normal", enabled: ["error", "summary"] },
        { verbosity: "verbose", enabled: ["error", "summary", "verbose"] },
        { verbosity: "debug", enabled: ["error", "summary", "verbose", "debug"] },
    ];

    static caseName(entry: VerbosityCase): string {
        if (entry.enabled.length === 0) {
            return "verbosity " + entry.verbosity + " emits no levels";
        }

        return "verbosity " + entry.verbosity + " emits " + entry.enabled.join(" and ");
    }

    static emittedLevels(verbosity: Verbosity): LogLevel[] {
        const lines: string[] = [];
        const logger = Logger.forVerbosity(verbosity, (text) => {
            lines.push(text);
        });

        for (const level of LoggerFiltersByVerbosity.LEVELS) {
            logger.log(level, "message " + level);
        }

        return LoggerFiltersByVerbosity.LEVELS.filter((level) => lines.some((line) => line.includes("message " + level)));
    }

    static captured(): CapturedLogger {
        const entries: LogEntry[] = [];
        const logger = new Logger("debug", [{ write: (entry): void => void entries.push(entry) }]);

        return { logger, entries };
    }

    static silentLoggerEmits(level: LogLevel): boolean {
        let emitted = false;
        const logger = new Logger(Logger.VERBOSITY_LEVELS.silent, [
            {
                write: (): void => {
                    emitted = true;
                },
            },
        ]);

        logger.log(level, "dropped");

        return emitted;
    }

    static format(level: LogLevel, message: string): string {
        return Logger.format({ level, message });
    }
}
