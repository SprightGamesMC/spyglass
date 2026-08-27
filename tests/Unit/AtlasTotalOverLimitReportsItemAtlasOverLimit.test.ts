import assert from "node:assert/strict";
import { test } from "node:test";
import AtlasTotalOverLimitReportsItemAtlasOverLimit from "../Helpers/AtlasTotalOverLimitReportsItemAtlasOverLimit.js";

for (const entry of AtlasTotalOverLimitReportsItemAtlasOverLimit.CASES) {
    test(AtlasTotalOverLimitReportsItemAtlasOverLimit.ID + " " + entry.name, async () => {
        const result = await AtlasTotalOverLimitReportsItemAtlasOverLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
