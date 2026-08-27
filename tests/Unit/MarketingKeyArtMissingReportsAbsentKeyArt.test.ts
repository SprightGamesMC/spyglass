import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingKeyArtMissingReportsAbsentKeyArt from "../Helpers/MarketingKeyArtMissingReportsAbsentKeyArt.js";

for (const entry of MarketingKeyArtMissingReportsAbsentKeyArt.CASES) {
    test(MarketingKeyArtMissingReportsAbsentKeyArt.ID + " " + entry.name, async () => {
        const result = await MarketingKeyArtMissingReportsAbsentKeyArt.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
