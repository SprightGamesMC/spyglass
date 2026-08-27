import assert from "node:assert/strict";
import { test } from "node:test";
import PersonaThumbnailNotTransparentReportsOpaqueThumbnail from "../Helpers/PersonaThumbnailNotTransparentReportsOpaqueThumbnail.js";

for (const entry of PersonaThumbnailNotTransparentReportsOpaqueThumbnail.CASES) {
    test(PersonaThumbnailNotTransparentReportsOpaqueThumbnail.ID + " " + entry.name, async () => {
        const result = await PersonaThumbnailNotTransparentReportsOpaqueThumbnail.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
