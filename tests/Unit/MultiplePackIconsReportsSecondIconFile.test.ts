import assert from "node:assert/strict";
import { test } from "node:test";
import MultiplePackIconsReportsSecondIconFile from "../Helpers/MultiplePackIconsReportsSecondIconFile.js";

for (const entry of MultiplePackIconsReportsSecondIconFile.CASES) {
    test(MultiplePackIconsReportsSecondIconFile.ID + " " + entry.name, async () => {
        const result = await MultiplePackIconsReportsSecondIconFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
