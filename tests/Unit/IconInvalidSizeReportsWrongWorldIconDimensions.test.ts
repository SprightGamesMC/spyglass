import assert from "node:assert/strict";
import { test } from "node:test";
import IconInvalidSizeReportsWrongWorldIconDimensions from "../Helpers/IconInvalidSizeReportsWrongWorldIconDimensions.js";

for (const entry of IconInvalidSizeReportsWrongWorldIconDimensions.CASES) {
    test(IconInvalidSizeReportsWrongWorldIconDimensions.ID + " " + entry.name, async () => {
        const result = await IconInvalidSizeReportsWrongWorldIconDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
