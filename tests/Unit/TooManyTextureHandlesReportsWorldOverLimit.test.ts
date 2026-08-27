import assert from "node:assert/strict";
import { test } from "node:test";
import TooManyTextureHandlesReportsWorldOverLimit from "../Helpers/TooManyTextureHandlesReportsWorldOverLimit.js";

for (const entry of TooManyTextureHandlesReportsWorldOverLimit.CASES) {
    test(TooManyTextureHandlesReportsWorldOverLimit.ID + " " + entry.name, async () => {
        const findings = await TooManyTextureHandlesReportsWorldOverLimit.run(entry);

        if (!entry.expectFinding) {
            assert.deepEqual(findings, []);
            return;
        }

        assert.equal(findings.length, 1);
        assert.equal(findings[0].id, TooManyTextureHandlesReportsWorldOverLimit.ID);
        assert.equal(findings[0].path, "World");
    });
}
