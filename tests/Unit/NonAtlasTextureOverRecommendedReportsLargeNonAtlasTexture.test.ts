import assert from "node:assert/strict";
import { test } from "node:test";
import NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture from "../Helpers/NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture.js";

for (const entry of NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture.CASES) {
    test(NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture.ID + " " + entry.name, async () => {
        const result = await NonAtlasTextureOverRecommendedReportsLargeNonAtlasTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
