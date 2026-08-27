import assert from "node:assert/strict";
import { test } from "node:test";
import TitleMissingReportsAbsentOfferTitle from "../Helpers/TitleMissingReportsAbsentOfferTitle.js";

for (const entry of TitleMissingReportsAbsentOfferTitle.CASES) {
    test(TitleMissingReportsAbsentOfferTitle.ID + " " + entry.name, async () => {
        const result = await TitleMissingReportsAbsentOfferTitle.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
