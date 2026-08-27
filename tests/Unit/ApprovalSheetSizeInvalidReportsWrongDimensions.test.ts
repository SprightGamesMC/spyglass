import assert from "node:assert/strict";
import { test } from "node:test";
import ApprovalSheetSizeInvalidReportsWrongDimensions from "../Helpers/ApprovalSheetSizeInvalidReportsWrongDimensions.js";

for (const entry of ApprovalSheetSizeInvalidReportsWrongDimensions.CASES) {
    test(ApprovalSheetSizeInvalidReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await ApprovalSheetSizeInvalidReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
