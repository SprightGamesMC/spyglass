import assert from "node:assert/strict";
import { test } from "node:test";
import TieringInvalidReportsLowerTierNeedingMoreMemory from "../Helpers/TieringInvalidReportsLowerTierNeedingMoreMemory.js";

for (const entry of TieringInvalidReportsLowerTierNeedingMoreMemory.CASES) {
    test(TieringInvalidReportsLowerTierNeedingMoreMemory.ID + " " + entry.name, async () => {
        const result = await TieringInvalidReportsLowerTierNeedingMoreMemory.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
