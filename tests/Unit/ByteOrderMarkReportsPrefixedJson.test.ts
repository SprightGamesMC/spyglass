import assert from "node:assert/strict";
import { test } from "node:test";
import ByteOrderMarkReportsPrefixedJson from "../Helpers/ByteOrderMarkReportsPrefixedJson.js";

for (const entry of ByteOrderMarkReportsPrefixedJson.CASES) {
    test(ByteOrderMarkReportsPrefixedJson.ID + " " + entry.name, async () => {
        const findings = await ByteOrderMarkReportsPrefixedJson.run(entry.content);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, ByteOrderMarkReportsPrefixedJson.ID);
            assert.equal(findings[0].path, ByteOrderMarkReportsPrefixedJson.PATH);
        }
    });
}
