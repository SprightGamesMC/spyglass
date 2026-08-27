import assert from "node:assert/strict";
import { test } from "node:test";
import PathInvalidCharacterReportsUnsafeSegment from "../Helpers/PathInvalidCharacterReportsUnsafeSegment.js";

for (const entry of PathInvalidCharacterReportsUnsafeSegment.CASES) {
    test(PathInvalidCharacterReportsUnsafeSegment.ID + " " + entry.name, async () => {
        const findings = await PathInvalidCharacterReportsUnsafeSegment.run(entry.path);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, PathInvalidCharacterReportsUnsafeSegment.ID);
            assert.equal(findings[0].path, "BP/" + entry.path);
        }
    });
}
