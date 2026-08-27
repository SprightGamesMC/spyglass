import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DefinitionFormatVersionAboveExpectedReportsNewerVersion from "../Helpers/DefinitionFormatVersionAboveExpectedReportsNewerVersion.js";

for (const entry of DefinitionFormatVersionAboveExpectedReportsNewerVersion.CASES) {
    test(DefinitionFormatVersionAboveExpectedReportsNewerVersion.ID + " " + entry.name, async () => {
        const findings = await DefinitionFormatVersionAboveExpectedReportsNewerVersion.run(entry);

        assert.deepEqual(
            ModelFixture.ids(findings),
            entry.expectFinding ? [DefinitionFormatVersionAboveExpectedReportsNewerVersion.ID] : []
        );

        for (const finding of findings) {
            assert.equal(finding.path, entry.path);
            assert.equal(finding.location?.field, "format_version");
        }
    });
}
