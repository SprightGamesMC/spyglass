import assert from "node:assert/strict";
import { test } from "node:test";
import PathNotNamespacedReportsFolderWithoutUniqueForm from "../Helpers/PathNotNamespacedReportsFolderWithoutUniqueForm.js";

for (const entry of PathNotNamespacedReportsFolderWithoutUniqueForm.CASES) {
    test(PathNotNamespacedReportsFolderWithoutUniqueForm.ID + " " + entry.name, async () => {
        const found = await PathNotNamespacedReportsFolderWithoutUniqueForm.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
