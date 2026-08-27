import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingPartnerArtMissingReportsAbsentPartnerArt from "../Helpers/MarketingPartnerArtMissingReportsAbsentPartnerArt.js";

for (const entry of MarketingPartnerArtMissingReportsAbsentPartnerArt.CASES) {
    test(MarketingPartnerArtMissingReportsAbsentPartnerArt.ID + " " + entry.name, async () => {
        const result = await MarketingPartnerArtMissingReportsAbsentPartnerArt.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
