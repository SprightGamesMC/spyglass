import assert from "node:assert/strict";
import { test } from "node:test";
import StoreThumbnailSizeInvalidReportsWrongDimensions from "../Helpers/StoreThumbnailSizeInvalidReportsWrongDimensions.js";

for (const entry of StoreThumbnailSizeInvalidReportsWrongDimensions.CASES) {
    test(StoreThumbnailSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await StoreThumbnailSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
