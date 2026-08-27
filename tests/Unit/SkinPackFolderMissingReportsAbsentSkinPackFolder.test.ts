import assert from "node:assert/strict";
import { test } from "node:test";
import SkinPackFolderMissingReportsAbsentSkinPackFolder from "../Helpers/SkinPackFolderMissingReportsAbsentSkinPackFolder.js";

for (const entry of SkinPackFolderMissingReportsAbsentSkinPackFolder.CASES) {
    test(SkinPackFolderMissingReportsAbsentSkinPackFolder.ID + " " + entry.name, async () => {
        const result = await SkinPackFolderMissingReportsAbsentSkinPackFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
