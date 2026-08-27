import assert from "node:assert/strict";
import { test } from "node:test";
import FileDirectlyInTypeFolderReportsFileUnderTypeFolder from "../Helpers/FileDirectlyInTypeFolderReportsFileUnderTypeFolder.js";

for (const entry of FileDirectlyInTypeFolderReportsFileUnderTypeFolder.CASES) {
    test(FileDirectlyInTypeFolderReportsFileUnderTypeFolder.ID + " " + entry.name, async () => {
        const found = await FileDirectlyInTypeFolderReportsFileUnderTypeFolder.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
