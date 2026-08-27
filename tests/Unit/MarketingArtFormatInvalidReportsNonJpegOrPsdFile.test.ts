import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingArtFormatInvalidReportsNonJpegOrPsdFile from "../Helpers/MarketingArtFormatInvalidReportsNonJpegOrPsdFile.js";

for (const entry of MarketingArtFormatInvalidReportsNonJpegOrPsdFile.CASES) {
    test(MarketingArtFormatInvalidReportsNonJpegOrPsdFile.ID + " " + entry.name, async () => {
        const result = await MarketingArtFormatInvalidReportsNonJpegOrPsdFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
