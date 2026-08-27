import assert from "node:assert/strict";
import { test } from "node:test";
import StoreScreenshotCountInvalidReportsWrongCount from "../Helpers/StoreScreenshotCountInvalidReportsWrongCount.js";

for (const entry of StoreScreenshotCountInvalidReportsWrongCount.CASES) {
    test(StoreScreenshotCountInvalidReportsWrongCount.ID + " " + entry.name, async () => {
        const result = await StoreScreenshotCountInvalidReportsWrongCount.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
