import assert from "node:assert/strict";
import { test } from "node:test";
import StorePanoramaMissingReportsAbsentPanorama from "../Helpers/StorePanoramaMissingReportsAbsentPanorama.js";

for (const entry of StorePanoramaMissingReportsAbsentPanorama.CASES) {
    test(StorePanoramaMissingReportsAbsentPanorama.ID + " " + entry.name, async () => {
        const result = await StorePanoramaMissingReportsAbsentPanorama.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
