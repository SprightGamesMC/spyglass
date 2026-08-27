import assert from "node:assert/strict";
import { test } from "node:test";
import PackFolderNameInvalidReportsFolderWithoutPrefix from "../Helpers/PackFolderNameInvalidReportsFolderWithoutPrefix.js";

for (const entry of PackFolderNameInvalidReportsFolderWithoutPrefix.CASES) {
    test(PackFolderNameInvalidReportsFolderWithoutPrefix.ID + " " + entry.name, async () => {
        const result = await PackFolderNameInvalidReportsFolderWithoutPrefix.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
