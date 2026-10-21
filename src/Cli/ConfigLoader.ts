import type { ConfigFile, ConfigIgnore, ConfigSkip, SeverityOverride } from "../Types/CliTypes.js";
import fs from "node:fs";
import path from "node:path";
import ToolError from "../Errors/ToolError.js";
import UsageError from "../Errors/UsageError.js";
import JsoncParser from "../Loaders/JsoncParser.js";
import ArgumentParser from "./ArgumentParser.js";

export default abstract class ConfigLoader {
    static readonly EMPTY: ConfigFile = { skips: [], severityOverrides: [], ignores: [] };
    static readonly KEYS: readonly string[] = [
        "$schema",
        "contentType",
        "input",
        "layout",
        "output",
        "format",
        "verbosity",
        "noColor",
        "skip",
        "severity",
        "ignore",
        "failOn",
    ];
    private static readonly DEFAULT_FILE_NAME = "spyglass.config.json";
    private static readonly IGNORE_KEYS: readonly string[] = ["id", "reason", "path", "pack", "field"];
    private static readonly IGNORE_PATTERN_KEYS = ["path", "pack", "field"] as const;

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
        const unknownKey = Object.keys(record).find((key) => !ConfigLoader.KEYS.includes(key));

        if (unknownKey !== undefined) {
            throw new UsageError("Config file has unknown key " + unknownKey + ": " + source);
        }

        return {
            skips: ConfigLoader.parseSkips(record.skip, source),
            severityOverrides: ConfigLoader.parseSeverities(record.severity, source),
            ignores: ConfigLoader.parseIgnores(record.ignore, source),
            failOn: ConfigLoader.parseFailOn(record.failOn, source),
            contentType: ConfigLoader.parseContentType(record.contentType, source),
            input: ConfigLoader.parseInput(record.input, source),
            layout: ConfigLoader.parseLayout(record.layout, source),
            output: ConfigLoader.parseOutput(record.output, source),
            format: ConfigLoader.parseFormat(record.format, source),
            verbosity: ConfigLoader.parseVerbosity(record.verbosity, source),
            noColor: ConfigLoader.parseNoColor(record.noColor, source),
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

    private static parseIgnores(value: unknown, source: string): ConfigIgnore[] {
        if (value === undefined) {
            return [];
        }

        if (!Array.isArray(value)) {
            throw new UsageError("Config ignore must be an array: " + source);
        }

        return value.map((entry) => ConfigLoader.parseIgnoreEntry(entry, source));
    }

    private static parseIgnoreEntry(entry: unknown, source: string): ConfigIgnore {
        if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
            throw new UsageError("Config ignore entries must be objects with id and reason: " + source);
        }

        const record = entry as Record<string, unknown>;
        const unknownKey = Object.keys(record).find((key) => !ConfigLoader.IGNORE_KEYS.includes(key));

        if (unknownKey !== undefined) {
            throw new UsageError("Config ignore entry has unknown field " + unknownKey + ": " + source);
        }

        if (typeof record.id !== "string" || typeof record.reason !== "string" || record.reason.trim() === "") {
            throw new UsageError("Config ignore entries must have an id and a reason that is not empty: " + source);
        }

        let ignore: ConfigIgnore = { id: record.id, selector: ArgumentParser.parseSkip(record.id), reason: record.reason };

        for (const key of ConfigLoader.IGNORE_PATTERN_KEYS) {
            const value = record[key];

            if (value === undefined) {
                continue;
            }

            if (typeof value !== "string") {
                throw new UsageError("Config ignore " + key + " must be a string: " + source);
            }

            ignore = { ...ignore, [key]: value };
        }

        return ignore;
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
        return ConfigLoader.parseOneOf(value, ArgumentParser.FAIL_ON_LEVELS, "failOn", source);
    }

    private static parseContentType(value: unknown, source: string): ConfigFile["contentType"] {
        return ConfigLoader.parseOneOf(value, ArgumentParser.CONTENT_TYPES, "contentType", source);
    }

    private static parseLayout(value: unknown, source: string): ConfigFile["layout"] {
        return ConfigLoader.parseOneOf(value, ArgumentParser.LAYOUTS, "layout", source);
    }

    private static parseFormat(value: unknown, source: string): ConfigFile["format"] {
        return ConfigLoader.parseOneOf(value, ArgumentParser.FORMATS, "format", source);
    }

    private static parseVerbosity(value: unknown, source: string): ConfigFile["verbosity"] {
        return ConfigLoader.parseOneOf(value, ArgumentParser.VERBOSITIES, "verbosity", source);
    }

    private static parseInput(value: unknown, source: string): ConfigFile["input"] {
        return ConfigLoader.parsePath(value, "input", source);
    }

    private static parseOutput(value: unknown, source: string): ConfigFile["output"] {
        return ConfigLoader.parsePath(value, "output", source);
    }

    private static parseNoColor(value: unknown, source: string): ConfigFile["noColor"] {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== "boolean") {
            throw new UsageError("Config noColor must be true or false: " + source);
        }

        return value;
    }

    private static parsePath(value: unknown, key: string, source: string): string | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== "string") {
            throw new UsageError("Config " + key + " must be a string: " + source);
        }

        return path.resolve(path.dirname(source), value);
    }

    private static parseOneOf<T extends string>(value: unknown, allowed: readonly T[], key: string, source: string): T | undefined {
        if (value === undefined) {
            return undefined;
        }

        const found = allowed.find((candidate) => candidate === value);

        if (found === undefined) {
            throw new UsageError("Config " + key + " must be one of " + allowed.join(", ") + ": " + source);
        }

        return found;
    }
}
