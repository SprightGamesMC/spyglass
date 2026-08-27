import type { ContentType, Finding, Layout, ResolvedCheck, Severity } from "./CheckTypes.js";

export type ReportFormat = "text" | "json" | "csv";

export type Verbosity = "silent" | "summary" | "normal" | "verbose" | "debug";

export type FailOn = Severity | "none";

export interface SeverityCounts {
    readonly error: number;
    readonly warning: number;
    readonly recommendation: number;
}

export interface Report {
    readonly schemaVersion: number;
    readonly toolVersion: string;
    readonly startedAt: string;
    readonly input: string;
    readonly contentType: ContentType;
    readonly layout: Layout;
    readonly checks: readonly ResolvedCheck[];
    readonly findings: readonly Finding[];
    readonly counts: SeverityCounts;
    readonly countsByGroup: Readonly<Record<string, SeverityCounts>>;
    readonly passed: boolean;
}
