import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DefinitionFormatVersionBelowExpectedReportsOlderVersion from "../Helpers/DefinitionFormatVersionBelowExpectedReportsOlderVersion.js";

for (const entry of DefinitionFormatVersionBelowExpectedReportsOlderVersion.CASES) {
    test(DefinitionFormatVersionBelowExpectedReportsOlderVersion.ID + " " + entry.name, async () => {
        const findings = await DefinitionFormatVersionBelowExpectedReportsOlderVersion.run(entry);

        assert.deepEqual(
            ModelFixture.ids(findings),
            entry.expectFinding ? [DefinitionFormatVersionBelowExpectedReportsOlderVersion.ID] : []
        );

        for (const finding of findings) {
            assert.equal(finding.path, entry.path);
            assert.equal(finding.location?.field, "format_version");
        }
    });
}
