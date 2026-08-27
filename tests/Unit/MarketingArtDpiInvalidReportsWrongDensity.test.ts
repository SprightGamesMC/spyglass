import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingArtDpiInvalidReportsWrongDensity from "../Helpers/MarketingArtDpiInvalidReportsWrongDensity.js";

for (const entry of MarketingArtDpiInvalidReportsWrongDensity.CASES) {
    test(MarketingArtDpiInvalidReportsWrongDensity.ID + " " + entry.name, async () => {
        const result = await MarketingArtDpiInvalidReportsWrongDensity.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
