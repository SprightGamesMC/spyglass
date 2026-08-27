import assert from "node:assert/strict";
import { test } from "node:test";
import StoreArtFolderMissingReportsAbsentFolder from "../Helpers/StoreArtFolderMissingReportsAbsentFolder.js";

for (const entry of StoreArtFolderMissingReportsAbsentFolder.CASES) {
    test(StoreArtFolderMissingReportsAbsentFolder.ID + " " + entry.name, async () => {
        const result = await StoreArtFolderMissingReportsAbsentFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
