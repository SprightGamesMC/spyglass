import assert from "node:assert/strict";
import { test } from "node:test";
import StoreScreenshotSizeInvalidReportsWrongDimensions from "../Helpers/StoreScreenshotSizeInvalidReportsWrongDimensions.js";

for (const entry of StoreScreenshotSizeInvalidReportsWrongDimensions.CASES) {
    test(StoreScreenshotSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await StoreScreenshotSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
