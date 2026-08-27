import assert from "node:assert/strict";
import { test } from "node:test";
import TooFewSkinsReportsUnderFive from "../Helpers/TooFewSkinsReportsUnderFive.js";

for (const entry of TooFewSkinsReportsUnderFive.CASES) {
    test(TooFewSkinsReportsUnderFive.ID + " " + entry.name, async () => {
        const result = await TooFewSkinsReportsUnderFive.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
