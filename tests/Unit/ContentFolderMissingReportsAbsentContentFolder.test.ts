import assert from "node:assert/strict";
import { test } from "node:test";
import ContentFolderMissingReportsAbsentContentFolder from "../Helpers/ContentFolderMissingReportsAbsentContentFolder.js";

for (const entry of ContentFolderMissingReportsAbsentContentFolder.CASES) {
    test(ContentFolderMissingReportsAbsentContentFolder.ID + " " + entry.name, async () => {
        const result = await ContentFolderMissingReportsAbsentContentFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
