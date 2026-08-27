import assert from "node:assert/strict";
import { test } from "node:test";
import BaseContentUnusedInLowerTiersReportsHighOverlap from "../Helpers/BaseContentUnusedInLowerTiersReportsHighOverlap.js";

for (const entry of BaseContentUnusedInLowerTiersReportsHighOverlap.CASES) {
    test(BaseContentUnusedInLowerTiersReportsHighOverlap.ID + " " + entry.name, async () => {
        const result = await BaseContentUnusedInLowerTiersReportsHighOverlap.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
