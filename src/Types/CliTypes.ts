import type { ContentType, Layout, Severity } from "./CheckTypes.js";
import type { GameVersion } from "./LoaderTypes.js";
import type { FailOn, ReportFormat, Verbosity } from "./ReportTypes.js";

export type OverrideSource = "config" | "command line";

export interface SkipSelector {
    readonly group: string;
    readonly from?: number;
    readonly to?: number;
    readonly numbers?: readonly number[];
}

export interface SeverityOverride {
    readonly target: string;
    readonly severity: Severity;
}

export interface CliOptions {
    readonly contentType?: ContentType;
    readonly input: string;
    readonly layout: Layout;
    readonly skips: readonly SkipSelector[];
    readonly configPath?: string;
    readonly failOn?: FailOn;
    readonly severityOverrides: readonly SeverityOverride[];
    readonly output?: string;
    readonly format: ReportFormat;
    readonly verbosity: Verbosity;
    readonly noColor: boolean;
    readonly listRules: boolean;
    readonly help: boolean;
    readonly version: boolean;
}

export interface ConfigSkip {
    readonly selector: SkipSelector;
    readonly reason?: string;
}

export interface ConfigFile {
    readonly skips: readonly ConfigSkip[];
    readonly severityOverrides: readonly SeverityOverride[];
    readonly failOn?: FailOn;
}

export interface EffectiveSeverity {
    readonly value: Severity;
    readonly source?: OverrideSource;
}

export interface ReleaseCandidate {
    readonly text: string;
    readonly version: GameVersion;
}

export interface CliIo {
    writeOut(text: string): void;
    writeError(text: string): void;
    readonly isTerminal: boolean;
    readonly isErrorTerminal: boolean;
}

export interface VersionSources {
    readonly currentGameVersion: string;
    readonly betaModuleVersions: Readonly<Record<string, string>>;
}

export interface BetaModuleVersion {
    readonly moduleName: string;
    readonly version: string;
}
