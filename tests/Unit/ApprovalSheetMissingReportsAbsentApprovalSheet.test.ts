import assert from "node:assert/strict";
import { test } from "node:test";
import ApprovalSheetMissingReportsAbsentApprovalSheet from "../Helpers/ApprovalSheetMissingReportsAbsentApprovalSheet.js";

for (const entry of ApprovalSheetMissingReportsAbsentApprovalSheet.CASES) {
    test(ApprovalSheetMissingReportsAbsentApprovalSheet.ID + " " + entry.name, async () => {
        const result = await ApprovalSheetMissingReportsAbsentApprovalSheet.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
