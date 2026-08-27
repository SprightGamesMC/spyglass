import assert from "node:assert/strict";
import { test } from "node:test";
import SizeOverLimitReportsContentAboveByteLimit from "../Helpers/SizeOverLimitReportsContentAboveByteLimit.js";

for (const entry of SizeOverLimitReportsContentAboveByteLimit.CASES) {
    test(SizeOverLimitReportsContentAboveByteLimit.ID + " " + entry.name, async () => {
        const findings = await SizeOverLimitReportsContentAboveByteLimit.run(entry.packBytes, entry.outsideBytes);

        assert.deepEqual(
            findings.map((finding) => finding.id),
            entry.expectFinding ? [SizeOverLimitReportsContentAboveByteLimit.ID] : []
        );
    });
}
