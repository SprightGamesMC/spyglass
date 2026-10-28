import type { CheckContext, ContentType, ResolvedCheck } from "./Types/CheckTypes.js";
import type { CliIo, CliOptions, ConfigFile, FilteredFindings, RunSettings } from "./Types/CliTypes.js";
import type { Report, Verbosity } from "./Types/ReportTypes.js";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import CheckRegistry from "./Checks/CheckRegistry.js";
import CheckRunner from "./Checks/CheckRunner.js";
import ScriptChecks from "./Checks/Script/ScriptChecks.js";
import ArgumentParser from "./Cli/ArgumentParser.js";
import CheckSetResolver from "./Cli/CheckSetResolver.js";
import ConfigLoader from "./Cli/ConfigLoader.js";
import ExitCodes from "./Cli/ExitCodes.js";
import FindingFilter from "./Cli/FindingFilter.js";
import Logger from "./Cli/Logger.js";
import ReportBuilder from "./Cli/ReportBuilder.js";
import CsvReporter from "./Cli/Reporters/CsvReporter.js";
import JsonReporter from "./Cli/Reporters/JsonReporter.js";
import TextReporter from "./Cli/Reporters/TextReporter.js";
import VersionFetcher from "./Cli/VersionFetcher.js";
import ToolError from "./Errors/ToolError.js";
import UsageError from "./Errors/UsageError.js";
import Loaders from "./Loaders/Loaders.js";
import ModelBuilder from "./Model/ModelBuilder.js";
import StorageFactory from "./Storage/StorageFactory.js";

export default abstract class Main {
    static readonly TOOL_VERSION = "0.4.0";
    private static readonly DEFAULT_VERBOSITY: Verbosity = "normal";
    private static readonly FINDINGS_HIDDEN_VERBOSITIES: readonly Verbosity[] = ["silent", "summary"];
    private static readonly MILLISECONDS_SUFFIX = /\.\d{3}Z$/;
    private static readonly HELP_TEXT = [
        "Usage: spyglass check [contentType] [options]",
        "",
        "contentType: addon, world, skin, texture, or persona. Default: contentType in the config",
        "",
        "Options:",
        "  --input <path>            Folder or archive to validate. Default: current directory",
        "  --layout <standard|marketplace>",
        "  --skip <selector>         GROUP, GROUP/N, GROUP/N,N, GROUP/N-M. Repeatable",
        "  --config <file>           JSON config. Default: spyglass.config.json in the working directory",
        "  --fail-on <error|warning|recommendation|none>",
        "  --severity <id>=<level>   Override severity of a check or group. Repeatable",
        "  --output <folder>         Write report file into a folder instead of stdout",
        "  --format <text|json|csv>",
        "  --verbosity <silent|summary|normal|verbose|debug>",
        "  --no-color",
        "  --list-rules              Print the check catalog or the resolved check set",
        "  --version, -v",
        "  --help, -h",
        "",
        "Every option except --config, --help, --version, and --list-rules can also be set in the config.",
    ].join("\n");

    static async run(argv: readonly string[], io: CliIo, workingDirectory: string, environment: NodeJS.ProcessEnv): Promise<number> {
        let logger = Logger.forVerbosity(Main.DEFAULT_VERBOSITY, io.writeError);

        try {
            const options = ArgumentParser.parse(argv);

            if (options.help || (options.command === undefined && !options.version && !options.listRules)) {
                io.writeOut(Main.HELP_TEXT + "\n");

                return ExitCodes.PASS;
            }

            if (options.version) {
                io.writeOut(Main.TOOL_VERSION + "\n");

                return ExitCodes.PASS;
            }

            logger = Logger.forVerbosity(options.verbosity ?? Main.DEFAULT_VERBOSITY, io.writeError);

            const config = ConfigLoader.load(options.configPath, workingDirectory);
            const settings = Main.combine(options, config);

            logger = Logger.forVerbosity(settings.verbosity, io.writeError);

            return await Main.execute(options, settings, config, logger, io, workingDirectory, environment);
        } catch (error) {
            return Main.handleError(error, logger);
        }
    }

    private static combine(options: CliOptions, config: ConfigFile): RunSettings {
        return {
            contentType: options.contentType ?? config.contentType,
            input: options.input ?? config.input ?? ".",
            layout: options.layout ?? config.layout ?? "standard",
            output: options.output ?? config.output,
            format: options.format ?? config.format ?? "text",
            verbosity: options.verbosity ?? config.verbosity ?? Main.DEFAULT_VERBOSITY,
            noColor: options.noColor ?? config.noColor ?? false,
            failOn: options.failOn ?? config.failOn ?? "error",
        };
    }

    private static async execute(
        options: CliOptions,
        settings: RunSettings,
        config: ConfigFile,
        logger: Logger,
        io: CliIo,
        workingDirectory: string,
        environment: NodeJS.ProcessEnv
    ): Promise<number> {
        const resolved = CheckSetResolver.resolve(
            CheckRegistry.definitions(),
            settings.contentType,
            settings.layout,
            config,
            options.skips,
            options.severityOverrides
        );

        if (options.listRules) {
            io.writeOut(TextReporter.renderRules(resolved));

            return ExitCodes.PASS;
        }

        if (settings.contentType === undefined) {
            throw new UsageError(
                "Content type is required. Give it after check, as in spyglass check addon, or as contentType in the config. One of " +
                    ArgumentParser.CONTENT_TYPES.join(", ")
            );
        }

        const startedAt = Main.startTimestamp();
        const startedMilliseconds = performance.now();
        const report = await Main.validate(
            settings,
            settings.contentType,
            logger,
            workingDirectory,
            environment,
            resolved,
            config,
            startedAt
        );

        Main.writeReport(report, settings, logger, io, workingDirectory, performance.now() - startedMilliseconds);

        return report.passed ? ExitCodes.PASS : ExitCodes.FAIL;
    }

    private static async validate(
        settings: RunSettings,
        contentType: ContentType,
        logger: Logger,
        workingDirectory: string,
        environment: NodeJS.ProcessEnv,
        resolved: readonly ResolvedCheck[],
        config: ConfigFile,
        startedAt: string
    ): Promise<Report> {
        const inputPath = path.resolve(workingDirectory, settings.input);

        logger.verbose("Validating " + inputPath + " as " + contentType + " with " + settings.layout + " layout");

        const storage = await StorageFactory.open(inputPath);
        const needsNpm = resolved.some(
            (check) =>
                !check.skipped && check.definition.group === "SCRIPT" && check.definition.number === ScriptChecks.BETA_MODULE_OUTDATED
        );
        const versionSources = await VersionFetcher.fetch(environment, needsNpm, logger);
        logger.verbose("Current game version " + versionSources.currentGameVersion);
        logger.verbose("Beta module versions " + Main.describeBetaModules(versionSources.betaModuleVersions));

        const loaders = new Loaders(storage, versionSources, undefined, logger);
        const model = await new ModelBuilder(storage, settings.layout, loaders.json).build();
        const context: CheckContext = { model, loaders, contentType };

        logger.debug(Main.describeModel(model));

        const findings = await new CheckRunner(CheckRegistry.all(), resolved).run(context, (entry) => {
            logger.verbose(entry.id + " " + entry.findingCount + " findings " + entry.durationMilliseconds.toFixed(1) + " ms");
        });

        const filtered = FindingFilter.apply(findings, config.ignores, resolved);

        Main.logIgnores(filtered, logger);

        return ReportBuilder.build(
            Main.TOOL_VERSION,
            startedAt,
            inputPath,
            contentType,
            settings.layout,
            resolved,
            filtered.kept,
            filtered.ignored,
            settings.failOn
        );
    }

    private static logIgnores(filtered: FilteredFindings, logger: Logger): void {
        for (const entry of filtered.ignored) {
            logger.verbose("Ignored " + entry.finding.id + " " + (entry.finding.path ?? "") + ": " + entry.reason);
        }

        for (const ignore of filtered.unused) {
            logger.summary("Notice: config ignore entry " + FindingFilter.describe(ignore) + " matched no finding");
        }
    }

    private static describeBetaModules(versions: Readonly<Record<string, string>>): string {
        const entries = Object.entries(versions).map(([name, version]) => name + " " + version);

        return entries.length === 0 ? "none" : entries.join(", ");
    }

    private static describeModel(model: CheckContext["model"]): string {
        const packs = model.packs.map((pack) => pack.type + " pack at '" + pack.root + "' with " + pack.items.length + " items");
        const worlds = model.worlds.map((world) => "world at '" + world.root + "' with " + world.items.length + " items");

        return [...packs, ...worlds, model.filesOutsidePacks.length + " files outside packs", model.art.length + " art files"].join("\n");
    }

    private static startTimestamp(): string {
        return new Date().toISOString().replace(Main.MILLISECONDS_SUFFIX, "Z");
    }

    private static writeReport(
        report: Report,
        settings: RunSettings,
        logger: Logger,
        io: CliIo,
        workingDirectory: string,
        elapsedMilliseconds: number
    ): void {
        const color = !settings.noColor && io.isTerminal && settings.output === undefined;
        const text = Main.renderReport(report, settings, color);

        if (settings.output === undefined) {
            if (Main.showsFindings(settings)) {
                io.writeOut(text);
            }
        } else {
            Main.writeReportFile(Main.withSummary(text, report, settings, elapsedMilliseconds), settings, workingDirectory);
        }

        logger.summary(TextReporter.renderSummary(report, elapsedMilliseconds, !settings.noColor && io.isErrorTerminal));
    }

    private static withSummary(text: string, report: Report, settings: RunSettings, elapsedMilliseconds: number): string {
        if (settings.format !== "text") {
            return text;
        }

        return text + TextReporter.renderSummary(report, elapsedMilliseconds, false) + "\n";
    }

    private static showsFindings(settings: RunSettings): boolean {
        return settings.format !== "text" || !Main.FINDINGS_HIDDEN_VERBOSITIES.includes(settings.verbosity);
    }

    private static writeReportFile(text: string, settings: RunSettings, workingDirectory: string): void {
        const folder = path.resolve(workingDirectory, settings.output ?? "");

        try {
            fs.mkdirSync(folder, { recursive: true });
            fs.writeFileSync(path.join(folder, "spyglass.report." + Main.extensionFor(settings)), text);
        } catch (error) {
            throw new ToolError("Could not write report to " + folder, error);
        }
    }

    private static renderReport(report: Report, settings: RunSettings, color: boolean): string {
        switch (settings.format) {
            case "json":
                return JsonReporter.render(report);
            case "csv":
                return CsvReporter.render(report);
            case "text":
                return TextReporter.render(report, color);
        }
    }

    private static extensionFor(settings: RunSettings): string {
        return settings.format === "text" ? "txt" : settings.format;
    }

    private static handleError(error: unknown, logger: Logger): number {
        if (error instanceof UsageError) {
            logger.error("Usage error: " + error.message);

            return ExitCodes.USAGE_ERROR;
        }

        logger.error("Tool error: " + ToolError.describe(error));

        return ExitCodes.TOOL_ERROR;
    }
}
