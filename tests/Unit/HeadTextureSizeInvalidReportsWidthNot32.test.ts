import assert from "node:assert/strict";
import { test } from "node:test";
import HeadTextureSizeInvalidReportsWidthNot32 from "../Helpers/HeadTextureSizeInvalidReportsWidthNot32.js";

for (const entry of HeadTextureSizeInvalidReportsWidthNot32.CASES) {
    test(HeadTextureSizeInvalidReportsWidthNot32.ID + " " + entry.name, async () => {
        const result = await HeadTextureSizeInvalidReportsWidthNot32.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
