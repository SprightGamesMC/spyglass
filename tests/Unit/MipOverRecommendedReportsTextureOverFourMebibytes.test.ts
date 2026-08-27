import assert from "node:assert/strict";
import { test } from "node:test";
import MipOverRecommendedReportsTextureOverFourMebibytes from "../Helpers/MipOverRecommendedReportsTextureOverFourMebibytes.js";

for (const entry of MipOverRecommendedReportsTextureOverFourMebibytes.CASES) {
    test(MipOverRecommendedReportsTextureOverFourMebibytes.ID + " " + entry.name, async () => {
        const result = await MipOverRecommendedReportsTextureOverFourMebibytes.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
