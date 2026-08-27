import assert from "node:assert/strict";
import { test } from "node:test";
import LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption from "../Helpers/LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption.js";
import WorldTemplateFixture from "../Helpers/World/WorldTemplateFixture.js";

for (const entry of LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption.CASES) {
    test(LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption.ID + " " + entry.name, async () => {
        const findings = await LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, LockTemplateOptionsMissingReportsFormatTwoHeaderWithoutOption.ID);
            assert.equal(finding.path, WorldTemplateFixture.MANIFEST_PATH);
            assert.equal(finding.pack, "World");
            assert.equal(finding.location?.field, "header.lock_template_options");
        }
    });
}
