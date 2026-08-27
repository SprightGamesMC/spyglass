import type { Report } from "../../Types/ReportTypes.js";
import CheckIds from "../../Checks/CheckIds.js";

export default abstract class JsonReporter {
    static render(report: Report): string {
        const output = {
            schema_version: report.schemaVersion,
            tool_version: report.toolVersion,
            started_at: report.startedAt,
            input: report.input,
            content_type: report.contentType,
            layout: report.layout,
            passed: report.passed,
            counts: report.counts,
            counts_by_group: report.countsByGroup,
            checks: report.checks.map((check) => ({
                id: CheckIds.of(check.definition),
                slug: check.definition.slug,
                severity: check.severity,
                skipped: check.skipped,
                skip_reason: check.skipReason,
            })),
            findings: report.findings.map((finding) => ({
                id: finding.id,
                slug: finding.slug,
                severity: finding.severity,
                message: finding.message,
                path: finding.path,
                pack: finding.pack,
                location: finding.location,
            })),
        };

        return JSON.stringify(output, null, 2) + "\n";
    }
}
