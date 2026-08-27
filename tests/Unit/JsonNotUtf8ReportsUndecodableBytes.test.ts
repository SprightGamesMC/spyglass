import assert from "node:assert/strict";
import { test } from "node:test";
import JsonNotUtf8ReportsUndecodableBytes from "../Helpers/JsonNotUtf8ReportsUndecodableBytes.js";

for (const entry of JsonNotUtf8ReportsUndecodableBytes.CASES) {
    test(JsonNotUtf8ReportsUndecodableBytes.ID + " " + entry.name, async () => {
        const findings = await JsonNotUtf8ReportsUndecodableBytes.run(entry.content);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, JsonNotUtf8ReportsUndecodableBytes.ID);
            assert.equal(findings[0].path, JsonNotUtf8ReportsUndecodableBytes.PATH);
        }
    });
}
