import assert from "node:assert/strict";
import { test } from "node:test";
import EasterEggMissingReportsAbsentKey from "../Helpers/EasterEggMissingReportsAbsentKey.js";

for (const entry of EasterEggMissingReportsAbsentKey.CASES) {
    test(EasterEggMissingReportsAbsentKey.ID + " " + entry.name, async () => {
        const result = await EasterEggMissingReportsAbsentKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
