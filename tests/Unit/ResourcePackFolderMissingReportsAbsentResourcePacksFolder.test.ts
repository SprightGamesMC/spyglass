import assert from "node:assert/strict";
import { test } from "node:test";
import ResourcePackFolderMissingReportsAbsentResourcePacksFolder from "../Helpers/ResourcePackFolderMissingReportsAbsentResourcePacksFolder.js";

for (const entry of ResourcePackFolderMissingReportsAbsentResourcePacksFolder.CASES) {
    test(ResourcePackFolderMissingReportsAbsentResourcePacksFolder.ID + " " + entry.name, async () => {
        const result = await ResourcePackFolderMissingReportsAbsentResourcePacksFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
