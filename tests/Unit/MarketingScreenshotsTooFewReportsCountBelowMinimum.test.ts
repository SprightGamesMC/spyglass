import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingScreenshotsTooFewReportsCountBelowMinimum from "../Helpers/MarketingScreenshotsTooFewReportsCountBelowMinimum.js";

for (const entry of MarketingScreenshotsTooFewReportsCountBelowMinimum.CASES) {
    test(MarketingScreenshotsTooFewReportsCountBelowMinimum.ID + " " + entry.name, async () => {
        const result = await MarketingScreenshotsTooFewReportsCountBelowMinimum.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
