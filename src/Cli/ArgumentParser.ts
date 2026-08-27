import type { ContentType, Layout, Severity } from "../Types/CheckTypes.js";
import type { CliOptions, SeverityOverride, SkipSelector } from "../Types/CliTypes.js";
import type { FailOn, ReportFormat, Verbosity } from "../Types/ReportTypes.js";
import UsageError from "../Errors/UsageError.js";

export default abstract class ArgumentParser {
    static readonly CONTENT_TYPES: readonly ContentType[] = ["addon", "world", "skin", "texture", "persona"];
    static readonly FAIL_ON_LEVELS: readonly FailOn[] = ["error", "warning", "recommendation", "none"];
    private static readonly LAYOUTS: readonly Layout[] = ["standard", "marketplace"];
    private static readonly SEVERITIES: readonly Severity[] = ["error", "warning", "recommendation"];
    private static readonly FORMATS: readonly ReportFormat[] = ["text", "json", "csv"];
    private static readonly VERBOSITIES: readonly Verbosity[] = ["silent", "summary", "normal", "verbose", "debug"];

    static parse(argv: readonly string[]): CliOptions {
        let contentType: ContentType | undefined;
        let input = ".";
        let layout: Layout = "standard";
        const skips: SkipSelector[] = [];
        let configPath: string | undefined;
        let failOn: FailOn | undefined;
        const severityOverrides: SeverityOverride[] = [];
        let output: string | undefined;
        let format: ReportFormat = "text";
        let verbosity: Verbosity = "normal";
        let noColor = false;
        let listRules = false;
        let help = false;
        let version = false;
        let index = 0;

        const takeValue = (name: string): string => {
            const value = argv[index + 1];

            if (value === undefined || value.startsWith("--")) {
                throw new UsageError("Option " + name + " needs a value");
            }

            index += 1;

            return value;
        };

        while (index < argv.length) {
            const argument = argv[index];
            const [name, inlineValue] = ArgumentParser.splitInline(argument);
            const valueOf = (): string => (inlineValue !== undefined ? inlineValue : takeValue(name));

            switch (name) {
                case "--input":
                    input = valueOf();
                    break;
                case "--layout":
                    layout = ArgumentParser.oneOf(valueOf(), ArgumentParser.LAYOUTS, "--layout");
                    break;
                case "--skip":
                    skips.push(ArgumentParser.parseSkip(valueOf()));
                    break;
                case "--config":
                    configPath = valueOf();
                    break;
                case "--fail-on":
                    failOn = ArgumentParser.oneOf(valueOf(), ArgumentParser.FAIL_ON_LEVELS, "--fail-on");
                    break;
                case "--severity":
                    severityOverrides.push(ArgumentParser.parseSeverity(valueOf()));
                    break;
                case "--output":
                    output = valueOf();
                    break;
                case "--format":
                    format = ArgumentParser.oneOf(valueOf(), ArgumentParser.FORMATS, "--format");
                    break;
                case "--verbosity":
                    verbosity = ArgumentParser.oneOf(valueOf(), ArgumentParser.VERBOSITIES, "--verbosity");
                    break;
                case "--no-color":
                    noColor = true;
                    break;
                case "--list-rules":
                    listRules = true;
                    break;
                case "--help":
                case "-h":
                    help = true;
                    break;
                case "--version":
                case "-v":
                    version = true;
                    break;
                default:
                    contentType = ArgumentParser.parsePositional(argument, contentType);
            }

            index += 1;
        }

        return {
            contentType,
            input,
            layout,
            skips,
            configPath,
            failOn,
            severityOverrides,
            output,
            format,
            verbosity,
            noColor,
            listRules,
            help,
            version,
        };
    }

    static parseSkip(text: string): SkipSelector {
        const match = /^([A-Z]+)(?:\/(.+))?$/.exec(text.trim());

        if (match === null) {
            throw new UsageError("Invalid skip selector: " + text);
        }

        const group = match[1];
        const rest = match[2];

        if (rest === undefined) {
            return { group };
        }

        const range = /^(\d+)-(\d+)$/.exec(rest);

        if (range !== null) {
            return { group, from: Number(range[1]), to: Number(range[2]) };
        }

        const numbers = rest.split(",").map((part) => part.trim());

        if (!numbers.every((part) => /^\d+$/.test(part))) {
            throw new UsageError("Invalid skip selector: " + text);
        }

        return { group, numbers: numbers.map(Number) };
    }

    static parseSeverity(text: string): SeverityOverride {
        const separator = text.indexOf("=");

        if (separator <= 0) {
            throw new UsageError("Invalid severity override: " + text + ". Expected ID=level");
        }

        const target = text.slice(0, separator).trim();
        const severity = ArgumentParser.oneOf(text.slice(separator + 1).trim(), ArgumentParser.SEVERITIES, "--severity");

        if (!/^[A-Z]+(\/\d+)?$/.test(target)) {
            throw new UsageError("Invalid severity override target: " + target);
        }

        return { target, severity };
    }

    private static splitInline(argument: string): [string, string | undefined] {
        if (!argument.startsWith("--")) {
            return [argument, undefined];
        }

        const equals = argument.indexOf("=");

        if (equals < 0) {
            return [argument, undefined];
        }

        return [argument.slice(0, equals), argument.slice(equals + 1)];
    }

    private static parsePositional(argument: string, existing: ContentType | undefined): ContentType {
        if (argument.startsWith("-")) {
            throw new UsageError("Unknown option: " + argument);
        }

        if (existing !== undefined) {
            throw new UsageError("Unexpected argument: " + argument);
        }

        return ArgumentParser.oneOf(argument, ArgumentParser.CONTENT_TYPES, "content type");
    }

    private static oneOf<T extends string>(value: string, allowed: readonly T[], name: string): T {
        const found = allowed.find((candidate) => candidate === value);

        if (found === undefined) {
            throw new UsageError("Unknown " + name + " value: " + value + ". Expected one of " + allowed.join(", "));
        }

        return found;
    }
}
