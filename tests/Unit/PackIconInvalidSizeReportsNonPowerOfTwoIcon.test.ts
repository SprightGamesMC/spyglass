import assert from "node:assert/strict";
import { test } from "node:test";
import PackIconInvalidSizeReportsNonPowerOfTwoIcon from "../Helpers/PackIconInvalidSizeReportsNonPowerOfTwoIcon.js";

for (const entry of PackIconInvalidSizeReportsNonPowerOfTwoIcon.CASES) {
    test(PackIconInvalidSizeReportsNonPowerOfTwoIcon.ID + " " + entry.name, async () => {
        const result = await PackIconInvalidSizeReportsNonPowerOfTwoIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
