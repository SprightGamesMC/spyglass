import assert from "node:assert/strict";
import { test } from "node:test";
import PathCaseCollisionReportsCaseFoldedDuplicates from "../Helpers/PathCaseCollisionReportsCaseFoldedDuplicates.js";

for (const entry of PathCaseCollisionReportsCaseFoldedDuplicates.CASES) {
    test(PathCaseCollisionReportsCaseFoldedDuplicates.ID + " " + entry.name, async () => {
        const findings = await PathCaseCollisionReportsCaseFoldedDuplicates.run(entry.paths);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, PathCaseCollisionReportsCaseFoldedDuplicates.ID);

            for (const path of entry.paths) {
                assert.ok(findings[0].message.includes(path));
            }
        }
    });
}
