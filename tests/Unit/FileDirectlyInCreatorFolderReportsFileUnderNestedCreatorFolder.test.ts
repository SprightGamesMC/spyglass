import assert from "node:assert/strict";
import { test } from "node:test";
import FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder from "../Helpers/FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder.js";

for (const entry of FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder.CASES) {
    test(FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder.ID + " " + entry.name, async () => {
        const found = await FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
