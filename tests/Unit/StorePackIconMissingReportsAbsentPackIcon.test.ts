import assert from "node:assert/strict";
import { test } from "node:test";
import StorePackIconMissingReportsAbsentPackIcon from "../Helpers/StorePackIconMissingReportsAbsentPackIcon.js";

for (const entry of StorePackIconMissingReportsAbsentPackIcon.CASES) {
    test(StorePackIconMissingReportsAbsentPackIcon.ID + " " + entry.name, async () => {
        const result = await StorePackIconMissingReportsAbsentPackIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
