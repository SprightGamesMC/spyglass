import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationFileNotFoundReportsMissingFile from "../Helpers/AnimationFileNotFoundReportsMissingFile.js";

for (const entry of AnimationFileNotFoundReportsMissingFile.CASES) {
    test(AnimationFileNotFoundReportsMissingFile.ID + " " + entry.name, async () => {
        const result = await AnimationFileNotFoundReportsMissingFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
