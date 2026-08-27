import assert from "node:assert/strict";
import { test } from "node:test";
import StorePackIconSizeInvalidReportsWrongDimensions from "../Helpers/StorePackIconSizeInvalidReportsWrongDimensions.js";

for (const entry of StorePackIconSizeInvalidReportsWrongDimensions.CASES) {
    test(StorePackIconSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await StorePackIconSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
