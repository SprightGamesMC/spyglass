import assert from "node:assert/strict";
import { test } from "node:test";
import BodyTextureSizeInvalidReportsWidthNot128 from "../Helpers/BodyTextureSizeInvalidReportsWidthNot128.js";

for (const entry of BodyTextureSizeInvalidReportsWidthNot128.CASES) {
    test(BodyTextureSizeInvalidReportsWidthNot128.ID + " " + entry.name, async () => {
        const result = await BodyTextureSizeInvalidReportsWidthNot128.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
