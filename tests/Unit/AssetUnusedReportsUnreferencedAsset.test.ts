import assert from "node:assert/strict";
import { test } from "node:test";
import AssetUnusedReportsUnreferencedAsset from "../Helpers/AssetUnusedReportsUnreferencedAsset.js";

for (const entry of AssetUnusedReportsUnreferencedAsset.CASES) {
    test(AssetUnusedReportsUnreferencedAsset.ID + " " + entry.name, async () => {
        const result = await AssetUnusedReportsUnreferencedAsset.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
