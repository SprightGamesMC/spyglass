import type { Finding, Severity } from "../../src/Types/CheckTypes.js";
import type { Report } from "../../src/Types/ReportTypes.js";
import type { SummaryColorCase } from "../Types/TextSummaryPutsResultLastAndColorsCountsTypes.js";
import ReportBuilder from "../../src/Cli/ReportBuilder.js";
import TextReporter from "../../src/Cli/Reporters/TextReporter.js";

export default abstract class TextSummaryPutsResultLastAndColorsCounts {
    static readonly STARTED_AT = "2026-01-02T03:04:05Z";
    static readonly ESCAPE = "\u001b";
    static readonly RESET = "\u001b[0m";
    static readonly GREEN = "\u001b[32m";
    static readonly GRAY = "\u001b[90m";
    static readonly CASES: readonly SummaryColorCase[] = [
        { severity: "error", label: "1 errors" },
        { severity: "warning", label: "1 warnings" },
        { severity: "recommendation", label: "1 recommendations" },
    ];
    private static readonly COLORS: Readonly<Record<Severity, string>> = {
        error: "\u001b[31m",
        warning: "\u001b[33m",
        recommendation: "\u001b[36m",
    };

    static render(severities: readonly Severity[], color: boolean, elapsedMilliseconds: number): string {
        return TextReporter.renderSummary(TextSummaryPutsResultLastAndColorsCounts.build(severities), elapsedMilliseconds, color);
    }

    static lines(severities: readonly Severity[], color: boolean, elapsedMilliseconds: number): string[] {
        return TextSummaryPutsResultLastAndColorsCounts.render(severities, color, elapsedMilliseconds).split("\n");
    }

    static colored(severity: Severity, text: string): string {
        return TextSummaryPutsResultLastAndColorsCounts.COLORS[severity] + text + TextSummaryPutsResultLastAndColorsCounts.RESET;
    }

    private static build(severities: readonly Severity[]): Report {
        const findings: Finding[] = severities.map((severity) => ({
            id: "FILE/201",
            slug: "json-invalid",
            severity,
            message: "JSON does not parse",
        }));

        return ReportBuilder.build(
            "0.0.0",
            TextSummaryPutsResultLastAndColorsCounts.STARTED_AT,
            "input",
            "addon",
            "standard",
            [],
            findings,
            "error"
        );
    }
}
