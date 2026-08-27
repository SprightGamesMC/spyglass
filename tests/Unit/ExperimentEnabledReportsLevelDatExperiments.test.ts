import assert from "node:assert/strict";
import { test } from "node:test";
import ExperimentEnabledReportsLevelDatExperiments from "../Helpers/ExperimentEnabledReportsLevelDatExperiments.js";

for (const entry of ExperimentEnabledReportsLevelDatExperiments.CASES) {
    test(ExperimentEnabledReportsLevelDatExperiments.ID + " " + entry.name, async () => {
        const findings = await ExperimentEnabledReportsLevelDatExperiments.run(entry);

        if (!entry.expectFinding) {
            assert.deepEqual(findings, []);
            return;
        }

        assert.equal(findings.length, 1);
        assert.equal(findings[0].id, ExperimentEnabledReportsLevelDatExperiments.ID);
        assert.equal(findings[0].path, "World/level.dat");
        assert.ok(findings[0].message.includes(entry.expectedText ?? ""));
    });
}
