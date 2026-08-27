import assert from "node:assert/strict";
import { test } from "node:test";
import JsonInvalidReportsUnparseableFile from "../Helpers/JsonInvalidReportsUnparseableFile.js";

for (const entry of JsonInvalidReportsUnparseableFile.CASES) {
    test(JsonInvalidReportsUnparseableFile.ID + " " + entry.name, async () => {
        const findings = await JsonInvalidReportsUnparseableFile.run(entry.content);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, JsonInvalidReportsUnparseableFile.ID);
            assert.equal(findings[0].path, "BP/entities/thing.json");
        }
    });
}
