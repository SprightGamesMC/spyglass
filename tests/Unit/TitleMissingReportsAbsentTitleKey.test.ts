import assert from "node:assert/strict";
import { test } from "node:test";
import TitleMissingReportsAbsentTitleKey from "../Helpers/TitleMissingReportsAbsentTitleKey.js";

for (const entry of TitleMissingReportsAbsentTitleKey.CASES) {
    test(TitleMissingReportsAbsentTitleKey.ID + " " + entry.name, async () => {
        const result = await TitleMissingReportsAbsentTitleKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
