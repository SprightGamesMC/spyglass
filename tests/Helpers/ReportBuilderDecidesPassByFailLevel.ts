import type { Finding, Severity } from "../../src/Types/CheckTypes.js";
import type { FailOn, Report } from "../../src/Types/ReportTypes.js";
import type { PassCase } from "../Types/ReportBuilderDecidesPassByFailLevelTypes.js";
import ReportBuilder from "../../src/Cli/ReportBuilder.js";
import CsvReporter from "../../src/Cli/Reporters/CsvReporter.js";
import JsonReporter from "../../src/Cli/Reporters/JsonReporter.js";
import TextReporter from "../../src/Cli/Reporters/TextReporter.js";

export default abstract class ReportBuilderDecidesPassByFailLevel {
    static readonly SCHEMA_VERSION = ReportBuilder.SCHEMA_VERSION;
    static readonly CSV_HEADER = CsvReporter.HEADER;
    static readonly CASES: readonly PassCase[] = [
        { severities: [], failOn: "error", passed: true },
        { severities: ["warning", "recommendation"], failOn: "error", passed: true },
        { severities: ["error"], failOn: "error", passed: false },
        { severities: ["warning"], failOn: "warning", passed: false },
        { severities: ["recommendation"], failOn: "warning", passed: true },
        { severities: ["recommendation"], failOn: "recommendation", passed: false },
        { severities: ["error", "warning"], failOn: "none", passed: true },
    ];

    static describe(entry: PassCase): string {
        const findings = entry.severities.length === 0 ? "no findings" : entry.severities.join(" and ") + " findings";
        const outcome = entry.passed ? "leaves the report passing" : "makes the report fail";

        return "fail on " + entry.failOn + " with " + findings + " " + outcome;
    }

    static build(severities: readonly Severity[], failOn: FailOn): Report {
        const findings: Finding[] = severities.map((severity, index) => ({
            id: index % 2 === 0 ? "FILE/201" : "MANIFEST/601",
            slug: "slug",
            severity,
            message: 'message with "quotes", and comma ' + index,
            path: "BP/file" + index + ".json",
        }));

        return ReportBuilder.build("0.0.0", "2026-01-02T03:04:05Z", "input", "addon", "standard", [], findings, failOn);
    }

    static renderText(report: Report): string {
        return TextReporter.render(report, false) + TextReporter.renderSummary(report, 0, false);
    }

    static renderJson(report: Report): Record<string, unknown> {
        return JSON.parse(JsonReporter.render(report)) as Record<string, unknown>;
    }

    static renderCsvLines(report: Report): string[] {
        return CsvReporter.render(report).trimEnd().split("\n");
    }
}
