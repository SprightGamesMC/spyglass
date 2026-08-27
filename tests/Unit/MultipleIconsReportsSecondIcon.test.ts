import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleIconsReportsSecondIcon from "../Helpers/MultipleIconsReportsSecondIcon.js";

for (const entry of MultipleIconsReportsSecondIcon.CASES) {
    test(MultipleIconsReportsSecondIcon.ID + " " + entry.name, async () => {
        const result = await MultipleIconsReportsSecondIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
