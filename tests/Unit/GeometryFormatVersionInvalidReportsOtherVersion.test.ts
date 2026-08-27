import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryFormatVersionInvalidReportsOtherVersion from "../Helpers/GeometryFormatVersionInvalidReportsOtherVersion.js";

for (const entry of GeometryFormatVersionInvalidReportsOtherVersion.CASES) {
    test(GeometryFormatVersionInvalidReportsOtherVersion.ID + " " + entry.name, async () => {
        const result = await GeometryFormatVersionInvalidReportsOtherVersion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
