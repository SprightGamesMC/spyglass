import assert from "node:assert/strict";
import { test } from "node:test";
import ScenarioReportsMatchExpected from "../Helpers/ScenarioReportsMatchExpected.js";

for (const scenario of ScenarioReportsMatchExpected.list()) {
    test("scenario " + scenario.name + " produces the same findings and exit code as its expected report", () => {
        const comparison = ScenarioReportsMatchExpected.compare(scenario);

        if (comparison.updated) {
            return;
        }

        assert.notEqual(comparison.expected, undefined, "no expected.json, run with SPYGLASS_UPDATE_SCENARIOS=1");
        assert.deepEqual(comparison.actual, comparison.expected);
        assert.equal(comparison.exitCode, ScenarioReportsMatchExpected.expectedExitCode(scenario));
    });
}
