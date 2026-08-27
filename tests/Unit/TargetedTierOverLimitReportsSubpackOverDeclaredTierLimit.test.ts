import assert from "node:assert/strict";
import { test } from "node:test";
import TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit from "../Helpers/TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.js";

for (const entry of TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.CASES) {
    test(TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.ID + " " + entry.name, async () => {
        const result = await TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
