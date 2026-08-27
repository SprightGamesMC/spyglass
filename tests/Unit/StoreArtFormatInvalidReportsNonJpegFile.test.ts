import assert from "node:assert/strict";
import { test } from "node:test";
import StoreArtFormatInvalidReportsNonJpegFile from "../Helpers/StoreArtFormatInvalidReportsNonJpegFile.js";

for (const entry of StoreArtFormatInvalidReportsNonJpegFile.CASES) {
    test(StoreArtFormatInvalidReportsNonJpegFile.ID + " " + entry.name, async () => {
        const result = await StoreArtFormatInvalidReportsNonJpegFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
