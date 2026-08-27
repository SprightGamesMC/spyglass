import assert from "node:assert/strict";
import { test } from "node:test";
import MarketingArtFolderMissingReportsAbsentFolder from "../Helpers/MarketingArtFolderMissingReportsAbsentFolder.js";

for (const entry of MarketingArtFolderMissingReportsAbsentFolder.CASES) {
    test(MarketingArtFolderMissingReportsAbsentFolder.ID + " " + entry.name, async () => {
        const result = await MarketingArtFolderMissingReportsAbsentFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
