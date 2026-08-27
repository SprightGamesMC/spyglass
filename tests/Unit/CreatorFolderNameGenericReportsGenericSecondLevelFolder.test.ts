import assert from "node:assert/strict";
import { test } from "node:test";
import CreatorFolderNameGenericReportsGenericSecondLevelFolder from "../Helpers/CreatorFolderNameGenericReportsGenericSecondLevelFolder.js";

for (const entry of CreatorFolderNameGenericReportsGenericSecondLevelFolder.CASES) {
    test(CreatorFolderNameGenericReportsGenericSecondLevelFolder.ID + " " + entry.name, async () => {
        const found = await CreatorFolderNameGenericReportsGenericSecondLevelFolder.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
