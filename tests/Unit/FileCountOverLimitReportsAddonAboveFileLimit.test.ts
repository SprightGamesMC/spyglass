import assert from "node:assert/strict";
import { test } from "node:test";
import FileCountOverLimitReportsAddonAboveFileLimit from "../Helpers/FileCountOverLimitReportsAddonAboveFileLimit.js";

for (const entry of FileCountOverLimitReportsAddonAboveFileLimit.CASES) {
    test(FileCountOverLimitReportsAddonAboveFileLimit.ID + " " + entry.name, async () => {
        const found = await FileCountOverLimitReportsAddonAboveFileLimit.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
