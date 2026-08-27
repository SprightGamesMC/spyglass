import assert from "node:assert/strict";
import { test } from "node:test";
import FileOutsidePackReportsFilesOutsidePacksUpToLimit from "../Helpers/FileOutsidePackReportsFilesOutsidePacksUpToLimit.js";

for (const entry of FileOutsidePackReportsFilesOutsidePacksUpToLimit.CASES) {
    test(FileOutsidePackReportsFilesOutsidePacksUpToLimit.ID + " " + entry.name, async () => {
        const findings = await FileOutsidePackReportsFilesOutsidePacksUpToLimit.run(entry.outsideCount);

        assert.equal(findings.length, entry.expectedFindings);
        assert.ok(findings.every((finding) => finding.id === FileOutsidePackReportsFilesOutsidePacksUpToLimit.ID));
        assert.ok(findings.every((finding) => finding.path?.startsWith("outside/")));
    });
}
