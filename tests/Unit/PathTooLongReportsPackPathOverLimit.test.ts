import assert from "node:assert/strict";
import { test } from "node:test";
import PathTooLongReportsPackPathOverLimit from "../Helpers/PathTooLongReportsPackPathOverLimit.js";

for (const entry of PathTooLongReportsPackPathOverLimit.CASES) {
    test(PathTooLongReportsPackPathOverLimit.ID + " " + entry.name, async () => {
        const findings = await PathTooLongReportsPackPathOverLimit.run(entry.packPath);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, PathTooLongReportsPackPathOverLimit.ID);
            assert.equal(findings[0].path, PathTooLongReportsPackPathOverLimit.PACK_ROOT + "/" + entry.packPath);
        }
    });
}
