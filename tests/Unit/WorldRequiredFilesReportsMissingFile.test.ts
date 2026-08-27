import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import WorldRequiredFilesReportsMissingFile from "../Helpers/WorldRequiredFilesReportsMissingFile.js";

for (const entry of WorldRequiredFilesReportsMissingFile.CASES) {
    test("WORLD/105 and WORLD/106 " + entry.name, async () => {
        const findings = await WorldRequiredFilesReportsMissingFile.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds]);

        for (const finding of findings) {
            assert.equal(finding.path, WorldRequiredFilesReportsMissingFile.ROOT);
        }
    });
}
