import assert from "node:assert/strict";
import { test } from "node:test";
import AtlasTotalOverRecommendedReportsRoundedBlockAtlas from "../Helpers/AtlasTotalOverRecommendedReportsRoundedBlockAtlas.js";

for (const entry of AtlasTotalOverRecommendedReportsRoundedBlockAtlas.CASES) {
    test(AtlasTotalOverRecommendedReportsRoundedBlockAtlas.ID + " " + entry.name, async () => {
        const result = await AtlasTotalOverRecommendedReportsRoundedBlockAtlas.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
