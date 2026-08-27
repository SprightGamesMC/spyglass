import assert from "node:assert/strict";
import { test } from "node:test";
import TierTotalOverRecommendedReportsAddonOverTierLimit from "../Helpers/TierTotalOverRecommendedReportsAddonOverTierLimit.js";

for (const entry of TierTotalOverRecommendedReportsAddonOverTierLimit.CASES) {
    test(TierTotalOverRecommendedReportsAddonOverTierLimit.ID + " " + entry.name, async () => {
        const result = await TierTotalOverRecommendedReportsAddonOverTierLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
