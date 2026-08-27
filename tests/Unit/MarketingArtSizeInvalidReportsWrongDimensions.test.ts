import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingArtSizeInvalidReportsWrongDimensions from "../Helpers/MarketingArtSizeInvalidReportsWrongDimensions.js";

for (const entry of MarketingArtSizeInvalidReportsWrongDimensions.CASES) {
    test(MarketingArtSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await MarketingArtSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
