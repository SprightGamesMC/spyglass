import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import FunctionEngineVersionTooLowReportsOldEngineVersion from "../Helpers/FunctionEngineVersionTooLowReportsOldEngineVersion.js";

for (const entry of FunctionEngineVersionTooLowReportsOldEngineVersion.CASES) {
    test(FunctionEngineVersionTooLowReportsOldEngineVersion.ID + " " + entry.name, async () => {
        const findings = await FunctionEngineVersionTooLowReportsOldEngineVersion.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds]);

        for (const finding of findings) {
            assert.equal(finding.path, FunctionEngineVersionTooLowReportsOldEngineVersion.MANIFEST_PATH);
        }
    });
}
