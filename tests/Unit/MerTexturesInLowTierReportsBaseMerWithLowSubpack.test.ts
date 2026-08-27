import assert from "node:assert/strict";
import { test } from "node:test";
import MerTexturesInLowTierReportsBaseMerWithLowSubpack from "../Helpers/MerTexturesInLowTierReportsBaseMerWithLowSubpack.js";

for (const entry of MerTexturesInLowTierReportsBaseMerWithLowSubpack.CASES) {
    test(MerTexturesInLowTierReportsBaseMerWithLowSubpack.ID + " " + entry.name, async () => {
        const result = await MerTexturesInLowTierReportsBaseMerWithLowSubpack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
