import type { CheckContext, ContentType, ResolvedCheck } from "./Types/CheckTypes.js";
import type { CliIo, CliOptions } from "./Types/CliTypes.js";
import type { FailOn, Report, Verbosity } from "./Types/ReportTypes.js";
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
    static readonly TOOL_VERSION = "0.1.0";
    private static readonly DEFAULT_VERBOSITY: Verbosity = "normal";
    private static readonly FINDINGS_HIDDEN_VERBOSITIES: readonly Verbosity[] = ["silent", "summary"];
    private static readonly MILLISECONDS_SUFFIX = /\.\d{3}Z$/;
    private static readonly HELP_TEXT = [
        "Usage: spyglass <addon|world|skin|texture|persona> [options]",
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
    ].join("\n");

    static async run(argv: readonly string[], io: CliIo, workingDirectory: string, environment: NodeJS.ProcessEnv): Promise<number> {
        let logger = Logger.forVerbosity(Main.DEFAULT_VERBOSITY, io.writeError);

        try {
            const options = ArgumentParser.parse(argv);

            logger = Logger.forVerbosity(options.verbosity, io.writeError);

            return await Main.execute(options, logger, io, workingDirectory, environment);
        } catch (error) {
            return Main.handleError(error, logger);
        }
    }

    private static async execute(
        options: CliOptions,
        logger: Logger,
        io: CliIo,
        workingDirectory: string,
        environment: NodeJS.ProcessEnv
    ): Promise<number> {
        if (options.help) {
            io.writeOut(Main.HELP_TEXT + "\n");

            return ExitCodes.PASS;
        }

        if (options.version) {
            io.writeOut(Main.TOOL_VERSION + "\n");

            return ExitCodes.PASS;
        }

        const config = ConfigLoader.load(options.configPath, workingDirectory);
        const resolved = CheckSetResolver.resolve(
            CheckRegistry.definitions(),
            options.contentType,
            options.layout,
            config,
            options.skips,
            options.severityOverrides
        );

        if (options.listRules) {
            io.writeOut(TextReporter.renderRules(resolved));

            return ExitCodes.PASS;
        }

        if (options.contentType === undefined) {
            throw new UsageError("Content type is required. One of " + ArgumentParser.CONTENT_TYPES.join(", "));
        }

        const startedAt = Main.startTimestamp();
        const startedMilliseconds = performance.now();
        const report = await Main.validate(
            options,
            options.contentType,
            logger,
            workingDirectory,
            environment,
            resolved,
            config.failOn,
            startedAt
        );

        Main.writeReport(report, options, logger, io, workingDirectory, performance.now() - startedMilliseconds);

        return report.passed ? ExitCodes.PASS : ExitCodes.FAIL;
    }

    private static async validate(
        options: CliOptions,
        contentType: ContentType,
        logger: Logger,
        workingDirectory: string,
        environment: NodeJS.ProcessEnv,
        resolved: readonly ResolvedCheck[],
        configFailOn: FailOn | undefined,
        startedAt: string
    ): Promise<Report> {
        const inputPath = path.resolve(workingDirectory, options.input);

        logger.verbose("Validating " + inputPath + " as " + contentType + " with " + options.layout + " layout");

        const storage = await StorageFactory.open(inputPath);
        const needsNpm = resolved.some(
            (check) =>
                !check.skipped && check.definition.group === "SCRIPT" && check.definition.number === ScriptChecks.BETA_MODULE_OUTDATED
        );
        const versionSources = await VersionFetcher.fetch(environment, needsNpm, logger);
        logger.verbose("Current game version " + versionSources.currentGameVersion);
        logger.verbose("Beta module versions " + Main.describeBetaModules(versionSources.betaModuleVersions));

        const loaders = new Loaders(storage, versionSources, undefined, logger);
        const model = await new ModelBuilder(storage, options.layout, loaders.json).build();
        const context: CheckContext = { model, loaders, contentType };

        logger.debug(Main.describeModel(model));

        const findings = await new CheckRunner(CheckRegistry.all(), resolved).run(context, (entry) => {
            logger.verbose(entry.id + " " + entry.findingCount + " findings " + entry.durationMilliseconds.toFixed(1) + " ms");
        });

        const failOn = options.failOn ?? configFailOn ?? "error";

        return ReportBuilder.build(Main.TOOL_VERSION, startedAt, inputPath, contentType, options.layout, resolved, findings, failOn);
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
        options: CliOptions,
        logger: Logger,
        io: CliIo,
        workingDirectory: string,
        elapsedMilliseconds: number
    ): void {
        const color = !options.noColor && io.isTerminal && options.output === undefined;
        const text = Main.renderReport(report, options, color);

        if (options.output === undefined) {
            if (Main.showsFindings(options)) {
                io.writeOut(text);
            }
        } else {
            Main.writeReportFile(Main.withSummary(text, report, options, elapsedMilliseconds), options, workingDirectory);
        }

        logger.summary(TextReporter.renderSummary(report, elapsedMilliseconds, !options.noColor && io.isErrorTerminal));
    }

    private static withSummary(text: string, report: Report, options: CliOptions, elapsedMilliseconds: number): string {
        if (options.format !== "text") {
            return text;
        }

        return text + TextReporter.renderSummary(report, elapsedMilliseconds, false) + "\n";
    }

    private static showsFindings(options: CliOptions): boolean {
        return options.format !== "text" || !Main.FINDINGS_HIDDEN_VERBOSITIES.includes(options.verbosity);
    }

    private static writeReportFile(text: string, options: CliOptions, workingDirectory: string): void {
        const folder = path.resolve(workingDirectory, options.output ?? "");

        try {
            fs.mkdirSync(folder, { recursive: true });
            fs.writeFileSync(path.join(folder, "spyglass.report." + Main.extensionFor(options)), text);
        } catch (error) {
            throw new ToolError("Could not write report to " + folder, error);
        }
    }

    private static renderReport(report: Report, options: CliOptions, color: boolean): string {
        switch (options.format) {
            case "json":
                return JsonReporter.render(report);
            case "csv":
                return CsvReporter.render(report);
            case "text":
                return TextReporter.render(report, color);
        }
    }

    private static extensionFor(options: CliOptions): string {
        return options.format === "text" ? "txt" : options.format;
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
