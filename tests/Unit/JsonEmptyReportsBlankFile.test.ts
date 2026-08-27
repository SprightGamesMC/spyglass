import assert from "node:assert/strict";
import { test } from "node:test";
import JsonEmptyReportsBlankFile from "../Helpers/JsonEmptyReportsBlankFile.js";

for (const entry of JsonEmptyReportsBlankFile.CASES) {
    test(JsonEmptyReportsBlankFile.ID + " " + entry.name, async () => {
        const findings = await JsonEmptyReportsBlankFile.run(entry.content);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, JsonEmptyReportsBlankFile.ID);
            assert.equal(findings[0].path, JsonEmptyReportsBlankFile.PATH);
        }
    });
}
