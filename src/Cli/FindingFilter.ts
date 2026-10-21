import type { Finding, ResolvedCheck } from "../Types/CheckTypes.js";
import type { ConfigIgnore, FilteredFindings } from "../Types/CliTypes.js";
import type { IgnoredFinding } from "../Types/ReportTypes.js";
import CheckIds from "../Checks/CheckIds.js";
import CheckSetResolver from "./CheckSetResolver.js";
import PathPattern from "./PathPattern.js";

export default abstract class FindingFilter {
    static apply(findings: readonly Finding[], ignores: readonly ConfigIgnore[], checks: readonly ResolvedCheck[]): FilteredFindings {
        const kept: Finding[] = [];
        const ignored: IgnoredFinding[] = [];
        const used = new Set<ConfigIgnore>();

        for (const finding of findings) {
            const ignore = ignores.find((entry) => FindingFilter.matches(entry, finding));

            if (ignore === undefined) {
                kept.push(finding);
                continue;
            }

            used.add(ignore);
            ignored.push({ finding, reason: ignore.reason });
        }

        const unused = ignores.filter((entry) => !used.has(entry) && FindingFilter.selectsRunningCheck(entry, checks));

        return { kept, ignored, unused };
    }

    static describe(ignore: ConfigIgnore): string {
        const parts = [ignore.id];

        for (const [label, value] of [
            ["path", ignore.path],
            ["pack", ignore.pack],
            ["field", ignore.field],
        ]) {
            if (value !== undefined) {
                parts.push(label + " " + value);
            }
        }

        return parts.join(" ");
    }

    private static matches(ignore: ConfigIgnore, finding: Finding): boolean {
        return (
            CheckSetResolver.matches(ignore.selector, finding.id) &&
            FindingFilter.matchesPattern(ignore.path, finding.path) &&
            FindingFilter.matchesPattern(ignore.pack, finding.pack) &&
            (ignore.field === undefined || ignore.field === finding.location?.field)
        );
    }

    private static matchesPattern(pattern: string | undefined, value: string | undefined): boolean {
        if (pattern === undefined) {
            return true;
        }

        return value !== undefined && PathPattern.matches(pattern, value);
    }

    private static selectsRunningCheck(ignore: ConfigIgnore, checks: readonly ResolvedCheck[]): boolean {
        return checks.some((check) => !check.skipped && CheckSetResolver.matches(ignore.selector, CheckIds.of(check.definition)));
    }
}
