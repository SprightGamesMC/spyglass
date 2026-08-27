import type { Finding, ResolvedCheck, Severity } from "../../Types/CheckTypes.js";
import type { Report, SeverityCounts } from "../../Types/ReportTypes.js";
import CheckIds from "../../Checks/CheckIds.js";

export default abstract class TextReporter {
    private static readonly COLORS: Readonly<Record<Severity, string>> = { error: "[31m", warning: "[33m", recommendation: "[36m" };
    private static readonly PASS_COLOR = "[32m";
    private static readonly GRAY = "[90m";
    private static readonly RESET = "[0m";
    private static readonly MILLISECONDS_PER_SECOND = 1000;

    static render(report: Report, color: boolean): string {
        if (report.findings.length === 0) {
            return "";
        }

        return report.findings.map((finding) => TextReporter.renderFinding(finding, color)).join("\n") + "\n";
    }

    static renderSummary(report: Report, elapsedMilliseconds: number, color: boolean): string {
        const lines = [
            TextReporter.gray("Run at " + report.startedAt, color),
            "Summary: " + TextReporter.renderCounts(report.counts, color),
        ];

        for (const [group, counts] of Object.entries(report.countsByGroup).sort(([left], [right]) => left.localeCompare(right))) {
            lines.push("  " + group + ": " + TextReporter.renderCounts(counts, color));
        }

        lines.push("Elapsed: " + TextReporter.renderElapsed(elapsedMilliseconds));
        lines.push("Result: " + TextReporter.renderResult(report.passed, color));

        return lines.join("\n");
    }

    static renderRules(checks: readonly ResolvedCheck[]): string {
        const lines = checks.map((check) => {
            const status = check.skipped ? "skip" : "run";
            const source = check.overrideSource === undefined ? "" : " (" + check.overrideSource + ")";
            const reason = check.skipReason === undefined ? "" : " " + check.skipReason;

            return [
                CheckIds.of(check.definition),
                check.definition.slug,
                check.definition.severity,
                check.severity + source,
                status + reason,
                check.definition.description,
            ].join("\t");
        });

        return lines.join("\n") + "\n";
    }

    private static renderFinding(finding: Finding, color: boolean): string {
        const severity = color ? TextReporter.COLORS[finding.severity] + finding.severity + TextReporter.RESET : finding.severity;
        const location = TextReporter.renderLocation(finding);

        return severity + " " + finding.id + " " + finding.slug + location + ": " + finding.message;
    }

    private static renderLocation(finding: Finding): string {
        if (finding.path === undefined) {
            return "";
        }

        const field = finding.location?.field === undefined ? "" : " " + finding.location.field;
        const line = finding.location?.line === undefined ? "" : ":" + finding.location.line;

        return " [" + finding.path + line + field + "]";
    }

    private static renderCounts(counts: SeverityCounts, color: boolean): string {
        return [
            TextReporter.renderCount(counts.error, "errors", "error", color),
            TextReporter.renderCount(counts.warning, "warnings", "warning", color),
            TextReporter.renderCount(counts.recommendation, "recommendations", "recommendation", color),
        ].join(", ");
    }

    private static renderCount(value: number, label: string, severity: Severity, color: boolean): string {
        const text = value + " " + label;

        if (!color) {
            return text;
        }

        if (value === 0) {
            return TextReporter.GRAY + text + TextReporter.RESET;
        }

        return TextReporter.COLORS[severity] + text + TextReporter.RESET;
    }

    private static renderResult(passed: boolean, color: boolean): string {
        const text = passed ? "pass" : "fail";

        if (!color) {
            return text;
        }

        return (passed ? TextReporter.PASS_COLOR : TextReporter.COLORS.error) + text + TextReporter.RESET;
    }

    private static renderElapsed(milliseconds: number): string {
        if (milliseconds < TextReporter.MILLISECONDS_PER_SECOND) {
            return Math.round(milliseconds) + " ms";
        }

        return (milliseconds / TextReporter.MILLISECONDS_PER_SECOND).toFixed(1) + " s";
    }

    private static gray(text: string, color: boolean): string {
        return color ? TextReporter.GRAY + text + TextReporter.RESET : text;
    }
}
