import assert from "node:assert/strict";
import { test } from "node:test";
import PackFolderAcronymMismatchReportsDifferentAcronyms from "../Helpers/PackFolderAcronymMismatchReportsDifferentAcronyms.js";

for (const entry of PackFolderAcronymMismatchReportsDifferentAcronyms.CASES) {
    test(PackFolderAcronymMismatchReportsDifferentAcronyms.ID + " " + entry.name, async () => {
        const result = await PackFolderAcronymMismatchReportsDifferentAcronyms.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
