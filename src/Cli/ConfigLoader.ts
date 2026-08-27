import type { ConfigFile, ConfigSkip, SeverityOverride } from "../Types/CliTypes.js";
import fs from "node:fs";
import path from "node:path";
import ToolError from "../Errors/ToolError.js";
import UsageError from "../Errors/UsageError.js";
import JsoncParser from "../Loaders/JsoncParser.js";
import ArgumentParser from "./ArgumentParser.js";

export default abstract class ConfigLoader {
    static readonly EMPTY: ConfigFile = { skips: [], severityOverrides: [] };
    private static readonly DEFAULT_FILE_NAME = "spyglass.config.json";

    static load(configPath: string | undefined, workingDirectory: string): ConfigFile {
        const resolved =
            configPath === undefined
                ? path.join(workingDirectory, ConfigLoader.DEFAULT_FILE_NAME)
                : path.resolve(workingDirectory, configPath);

        if (!fs.existsSync(resolved)) {
            if (configPath !== undefined) {
                throw new UsageError("Config file does not exist: " + resolved);
            }

            return ConfigLoader.EMPTY;
        }

        let parsed: unknown;

        try {
            parsed = JsoncParser.parse(fs.readFileSync(resolved, "utf-8"));
        } catch (error) {
            throw new UsageError("Config file does not parse: " + resolved + " (" + ToolError.describe(error) + ")");
        }

        return ConfigLoader.fromValue(parsed, resolved);
    }

    static fromValue(parsed: unknown, source: string): ConfigFile {
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new UsageError("Config file must be a JSON object: " + source);
        }

        const record = parsed as Record<string, unknown>;

        return {
            skips: ConfigLoader.parseSkips(record.skip, source),
            severityOverrides: ConfigLoader.parseSeverities(record.severity, source),
            failOn: ConfigLoader.parseFailOn(record.failOn, source),
        };
    }

    private static parseSkips(value: unknown, source: string): ConfigSkip[] {
        if (value === undefined) {
            return [];
        }

        if (!Array.isArray(value)) {
            throw new UsageError("Config skip must be an array: " + source);
        }

        return value.map((entry) => ConfigLoader.parseSkipEntry(entry, source));
    }

    private static parseSkipEntry(entry: unknown, source: string): ConfigSkip {
        if (typeof entry === "string") {
            return { selector: ArgumentParser.parseSkip(entry) };
        }

        if (typeof entry === "object" && entry !== null && typeof (entry as Record<string, unknown>).id === "string") {
            const record = entry as Record<string, unknown>;

            return {
                selector: ArgumentParser.parseSkip(record.id as string),
                reason: typeof record.reason === "string" ? record.reason : undefined,
            };
        }

        throw new UsageError("Config skip entries must be strings or objects with id: " + source);
    }

    private static parseSeverities(value: unknown, source: string): SeverityOverride[] {
        if (value === undefined) {
            return [];
        }

        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            throw new UsageError("Config severity must be an object of ID to level: " + source);
        }

        return Object.entries(value as Record<string, unknown>).map(([target, level]) => {
            if (typeof level !== "string") {
                throw new UsageError("Config severity for " + target + " must be a string: " + source);
            }

            return ArgumentParser.parseSeverity(target + "=" + level);
        });
    }

    private static parseFailOn(value: unknown, source: string): ConfigFile["failOn"] {
        if (value === undefined) {
            return undefined;
        }

        const found = ArgumentParser.FAIL_ON_LEVELS.find((level) => level === value);

        if (found === undefined) {
            throw new UsageError("Config failOn must be one of " + ArgumentParser.FAIL_ON_LEVELS.join(", ") + ": " + source);
        }

        return found;
    }
}
