import assert from "node:assert/strict";
import { test } from "node:test";
import SubpackFolderDuplicateReportsRepeatedFolderName from "../Helpers/SubpackFolderDuplicateReportsRepeatedFolderName.js";

for (const entry of SubpackFolderDuplicateReportsRepeatedFolderName.CASES) {
    test(SubpackFolderDuplicateReportsRepeatedFolderName.ID + " " + entry.name, async () => {
        const result = await SubpackFolderDuplicateReportsRepeatedFolderName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
