import assert from "node:assert/strict";
import { test } from "node:test";
import PackFolderCountInvalidReportsSecondPackInFolder from "../Helpers/PackFolderCountInvalidReportsSecondPackInFolder.js";

for (const entry of PackFolderCountInvalidReportsSecondPackInFolder.CASES) {
    test(PackFolderCountInvalidReportsSecondPackInFolder.ID + " " + entry.name, async () => {
        const result = await PackFolderCountInvalidReportsSecondPackInFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
