import assert from "node:assert/strict";
import { test } from "node:test";
import TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit from "../Helpers/TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit.js";

for (const entry of TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit.CASES) {
    test(TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit.ID + " " + entry.name, async () => {
        const result = await TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
