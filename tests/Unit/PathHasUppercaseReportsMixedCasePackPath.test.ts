import assert from "node:assert/strict";
import { test } from "node:test";
import PathHasUppercaseReportsMixedCasePackPath from "../Helpers/PathHasUppercaseReportsMixedCasePackPath.js";

for (const entry of PathHasUppercaseReportsMixedCasePackPath.CASES) {
    test(PathHasUppercaseReportsMixedCasePackPath.ID + " " + entry.name, async () => {
        const findings = await PathHasUppercaseReportsMixedCasePackPath.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, PathHasUppercaseReportsMixedCasePackPath.ID);
            assert.equal(findings[0].path, PathHasUppercaseReportsMixedCasePackPath.PACK_ROOT + "/" + entry.path);
            assert.equal(findings[0].pack, PathHasUppercaseReportsMixedCasePackPath.PACK_ROOT);
        }
    });
}

test(PathHasUppercaseReportsMixedCasePackPath.ID + " Extra/readme.txt outside any pack is measured from the input root", async () => {
    const findings = await PathHasUppercaseReportsMixedCasePackPath.runOutsidePack("Extra/readme.txt");

    assert.deepEqual(
        findings.map((finding) => finding.id),
        [PathHasUppercaseReportsMixedCasePackPath.ID]
    );
    assert.equal(findings[0].path, "Extra/readme.txt");
});
