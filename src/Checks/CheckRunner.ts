import type Check from "./Check.js";
import type { CheckContext, CheckProgress, Finding, ResolvedCheck } from "../Types/CheckTypes.js";
import ToolError from "../Errors/ToolError.js";
import CheckIds from "./CheckIds.js";

export default class CheckRunner {
    private readonly checks: readonly Check[];
    private readonly resolved: ReadonlyMap<string, ResolvedCheck>;

    private static compareFindings(left: Finding, right: Finding): number {
        const byId = CheckIds.compare(left.id, right.id);

        if (byId !== 0) {
            return byId;
        }

        const byPath = (left.path ?? "").localeCompare(right.path ?? "");

        if (byPath !== 0) {
            return byPath;
        }

        return left.message.localeCompare(right.message);
    }

    constructor(checks: readonly Check[], resolved: readonly ResolvedCheck[]) {
        this.checks = [...checks].sort((left, right) => CheckIds.compare(left.id, right.id));
        this.resolved = new Map(resolved.map((entry) => [CheckIds.of(entry.definition), entry]));
    }

    async run(context: CheckContext, onProgress?: (progress: CheckProgress) => void): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const check of this.checks) {
            const resolved = this.resolved.get(check.id);

            if (resolved === undefined || resolved.skipped) {
                continue;
            }

            const started = performance.now();
            const checkFindings = await this.runOne(check, context);
            const withSeverity = checkFindings.map((finding) => ({ ...finding, severity: resolved.severity }));

            findings.push(...withSeverity);
            onProgress?.({ id: check.id, durationMilliseconds: performance.now() - started, findingCount: withSeverity.length });
        }

        return findings.sort(CheckRunner.compareFindings);
    }

    private async runOne(check: Check, context: CheckContext): Promise<Finding[]> {
        try {
            return await check.run(context);
        } catch (error) {
            throw new ToolError("Check " + check.id + " failed: " + ToolError.describe(error), error);
        }
    }
}
