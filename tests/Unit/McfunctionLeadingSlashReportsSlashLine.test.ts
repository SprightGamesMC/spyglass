import assert from "node:assert/strict";
import { test } from "node:test";
import McfunctionLeadingSlashReportsSlashLine from "../Helpers/McfunctionLeadingSlashReportsSlashLine.js";

for (const entry of McfunctionLeadingSlashReportsSlashLine.CASES) {
    test(McfunctionLeadingSlashReportsSlashLine.ID + " " + entry.name, async () => {
        const findings = await McfunctionLeadingSlashReportsSlashLine.run(entry.functionText);

        assert.deepEqual(McfunctionLeadingSlashReportsSlashLine.lines(findings), entry.expectedLines);

        for (const finding of findings) {
            assert.equal(finding.id, McfunctionLeadingSlashReportsSlashLine.ID);
            assert.equal(finding.path, McfunctionLeadingSlashReportsSlashLine.FUNCTION_PATH);
        }
    });
}
