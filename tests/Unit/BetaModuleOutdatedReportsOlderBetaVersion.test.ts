import assert from "node:assert/strict";
import { test } from "node:test";
import BetaModuleOutdatedReportsOlderBetaVersion from "../Helpers/BetaModuleOutdatedReportsOlderBetaVersion.js";

for (const entry of BetaModuleOutdatedReportsOlderBetaVersion.CASES) {
    test(BetaModuleOutdatedReportsOlderBetaVersion.ID + " " + entry.name, async () => {
        const findings = await BetaModuleOutdatedReportsOlderBetaVersion.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, BetaModuleOutdatedReportsOlderBetaVersion.ID);
            assert.equal(finding.path, entry.packRoot + "/manifest.json");
            assert.equal(finding.pack, entry.packRoot);
            assert.equal(finding.location?.field, "dependencies[0].version");
        }
    });
}
