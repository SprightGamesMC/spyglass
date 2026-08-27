import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationFormatVersionInvalidReportsOtherVersion from "../Helpers/AnimationFormatVersionInvalidReportsOtherVersion.js";

for (const entry of AnimationFormatVersionInvalidReportsOtherVersion.CASES) {
    test(AnimationFormatVersionInvalidReportsOtherVersion.ID + " " + entry.name, async () => {
        const result = await AnimationFormatVersionInvalidReportsOtherVersion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
