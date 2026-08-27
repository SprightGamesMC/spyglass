import assert from "node:assert/strict";
import { test } from "node:test";
import ExperimentalTypeNotAllowedReportsExperimentalDefinition from "../Helpers/ExperimentalTypeNotAllowedReportsExperimentalDefinition.js";

for (const entry of ExperimentalTypeNotAllowedReportsExperimentalDefinition.CASES) {
    test(ExperimentalTypeNotAllowedReportsExperimentalDefinition.ID + " " + entry.name, async () => {
        const findings = await ExperimentalTypeNotAllowedReportsExperimentalDefinition.run(entry.packPath);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, ExperimentalTypeNotAllowedReportsExperimentalDefinition.ID);
            assert.equal(findings[0].path, "BP/" + entry.packPath);
        }
    });
}
