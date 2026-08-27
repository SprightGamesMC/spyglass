import assert from "node:assert/strict";
import { test } from "node:test";
import DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion from "../Helpers/DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion.js";

for (const entry of DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion.CASES) {
    test(DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion.ID + " " + entry.name, async () => {
        const findings = await DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion.ID);
            assert.equal(findings[0].path, entry.path);
        }
    });
}
