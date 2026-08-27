import assert from "node:assert/strict";
import { test } from "node:test";
import PreviewGifMissingReportsAbsentPreviewGif from "../Helpers/PreviewGifMissingReportsAbsentPreviewGif.js";

for (const entry of PreviewGifMissingReportsAbsentPreviewGif.CASES) {
    test(PreviewGifMissingReportsAbsentPreviewGif.ID + " " + entry.name, async () => {
        const result = await PreviewGifMissingReportsAbsentPreviewGif.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
