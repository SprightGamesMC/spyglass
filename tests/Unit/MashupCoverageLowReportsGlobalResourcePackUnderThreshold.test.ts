import assert from "node:assert/strict";
import { test } from "node:test";
import MashupCoverageLowReportsGlobalResourcePackUnderThreshold from "../Helpers/MashupCoverageLowReportsGlobalResourcePackUnderThreshold.js";

for (const entry of MashupCoverageLowReportsGlobalResourcePackUnderThreshold.CASES) {
    test(MashupCoverageLowReportsGlobalResourcePackUnderThreshold.ID + " " + entry.name, async () => {
        const findings = await MashupCoverageLowReportsGlobalResourcePackUnderThreshold.run(entry);

        if (!entry.expectFinding) {
            assert.deepEqual(findings, []);
            return;
        }

        assert.equal(findings.length, 1);
        assert.equal(findings[0].id, MashupCoverageLowReportsGlobalResourcePackUnderThreshold.ID);
        assert.equal(findings[0].pack, "RP");
        assert.equal(findings[0].path, "RP/manifest.json");
    });
}
