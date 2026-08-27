import assert from "node:assert/strict";
import { test } from "node:test";
import StoreThumbnailMissingReportsAbsentThumbnail from "../Helpers/StoreThumbnailMissingReportsAbsentThumbnail.js";

for (const entry of StoreThumbnailMissingReportsAbsentThumbnail.CASES) {
    test(StoreThumbnailMissingReportsAbsentThumbnail.ID + " " + entry.name, async () => {
        const result = await StoreThumbnailMissingReportsAbsentThumbnail.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
