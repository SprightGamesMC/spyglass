import assert from "node:assert/strict";
import { test } from "node:test";
import PackIconMissingReportsPackWithoutIcon from "../Helpers/PackIconMissingReportsPackWithoutIcon.js";

for (const entry of PackIconMissingReportsPackWithoutIcon.CASES) {
    test(PackIconMissingReportsPackWithoutIcon.ID + " " + entry.name, async () => {
        const result = await PackIconMissingReportsPackWithoutIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
