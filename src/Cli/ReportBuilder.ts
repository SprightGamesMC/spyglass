import type { ContentType, Finding, Layout, ResolvedCheck } from "../Types/CheckTypes.js";
import type { FailOn, Report, SeverityCounts } from "../Types/ReportTypes.js";
import CheckIds from "../Checks/CheckIds.js";

export default abstract class ReportBuilder {
    static readonly SCHEMA_VERSION = 1;

    static build(
        toolVersion: string,
        startedAt: string,
        input: string,
        contentType: ContentType,
        layout: Layout,
        checks: readonly ResolvedCheck[],
        findings: readonly Finding[],
        failOn: FailOn
    ): Report {
        const counts = ReportBuilder.count(findings);
        const countsByGroup: Record<string, SeverityCounts> = {};

        for (const finding of findings) {
            const group = CheckIds.groupOf(finding.id);

            countsByGroup[group] = ReportBuilder.add(countsByGroup[group], finding);
        }

        return {
            schemaVersion: ReportBuilder.SCHEMA_VERSION,
            toolVersion,
            startedAt,
            input,
            contentType,
            layout,
            checks,
            findings,
            counts,
            countsByGroup,
            passed: ReportBuilder.passes(counts, failOn),
        };
    }

    private static passes(counts: SeverityCounts, failOn: FailOn): boolean {
        switch (failOn) {
            case "none":
                return true;
            case "error":
                return counts.error === 0;
            case "warning":
                return counts.error === 0 && counts.warning === 0;
            case "recommendation":
                return counts.error === 0 && counts.warning === 0 && counts.recommendation === 0;
        }
    }

    private static count(findings: readonly Finding[]): SeverityCounts {
        let counts: SeverityCounts = { error: 0, warning: 0, recommendation: 0 };

        for (const finding of findings) {
            counts = ReportBuilder.add(counts, finding);
        }

        return counts;
    }

    private static add(counts: SeverityCounts | undefined, finding: Finding): SeverityCounts {
        const base = counts ?? { error: 0, warning: 0, recommendation: 0 };

        return { ...base, [finding.severity]: base[finding.severity] + 1 };
    }
}
