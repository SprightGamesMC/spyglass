import assert from "node:assert/strict";
import { test } from "node:test";
import StorePanoramaSizeInvalidReportsWrongDimensions from "../Helpers/StorePanoramaSizeInvalidReportsWrongDimensions.js";

for (const entry of StorePanoramaSizeInvalidReportsWrongDimensions.CASES) {
    test(StorePanoramaSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await StorePanoramaSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
