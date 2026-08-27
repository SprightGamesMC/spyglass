import assert from "node:assert/strict";
import { test } from "node:test";
import FileCountOverLimitReportsTooManyContentFiles from "../Helpers/FileCountOverLimitReportsTooManyContentFiles.js";

for (const entry of FileCountOverLimitReportsTooManyContentFiles.CASES) {
    test(FileCountOverLimitReportsTooManyContentFiles.ID + " " + entry.name, async () => {
        const findings = await FileCountOverLimitReportsTooManyContentFiles.run(entry);

        assert.deepEqual(
            findings.map((finding) => finding.id),
            entry.expectFinding ? [FileCountOverLimitReportsTooManyContentFiles.ID] : []
        );
    });
}
