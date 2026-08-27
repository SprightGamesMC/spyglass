import assert from "node:assert/strict";
import { test } from "node:test";
import CreatorFolderTooManySubfoldersReportsSecondProjectFolder from "../Helpers/CreatorFolderTooManySubfoldersReportsSecondProjectFolder.js";

for (const entry of CreatorFolderTooManySubfoldersReportsSecondProjectFolder.CASES) {
    test(CreatorFolderTooManySubfoldersReportsSecondProjectFolder.ID + " " + entry.name, async () => {
        const found = await CreatorFolderTooManySubfoldersReportsSecondProjectFolder.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
