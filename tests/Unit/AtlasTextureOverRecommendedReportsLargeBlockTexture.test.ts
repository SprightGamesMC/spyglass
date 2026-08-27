import assert from "node:assert/strict";
import { test } from "node:test";
import AtlasTextureOverRecommendedReportsLargeBlockTexture from "../Helpers/AtlasTextureOverRecommendedReportsLargeBlockTexture.js";

for (const entry of AtlasTextureOverRecommendedReportsLargeBlockTexture.CASES) {
    test(AtlasTextureOverRecommendedReportsLargeBlockTexture.ID + " " + entry.name, async () => {
        const result = await AtlasTextureOverRecommendedReportsLargeBlockTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
