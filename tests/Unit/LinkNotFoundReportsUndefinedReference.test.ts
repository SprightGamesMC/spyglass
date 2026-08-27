import assert from "node:assert/strict";
import { test } from "node:test";
import LinkNotFoundReportsUndefinedReference from "../Helpers/LinkNotFoundReportsUndefinedReference.js";

for (const entry of LinkNotFoundReportsUndefinedReference.CASES) {
    test(LinkNotFoundReportsUndefinedReference.ID + " " + entry.name, async () => {
        const findings = await LinkNotFoundReportsUndefinedReference.run(entry);

        assert.deepEqual(findings.map((finding) => finding.message).sort(), [...entry.expectedMessages]);

        for (const finding of findings) {
            assert.equal(finding.id, LinkNotFoundReportsUndefinedReference.ID);
            assert.ok(LinkNotFoundReportsUndefinedReference.EXPECTED_PATHS.includes(finding.path ?? ""));
            assert.equal(finding.pack, "RP");
        }
    });
}
