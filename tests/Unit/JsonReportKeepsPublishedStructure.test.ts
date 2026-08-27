import assert from "node:assert/strict";
import { test } from "node:test";
import JsonReportKeepsPublishedStructure from "../Helpers/JsonReportKeepsPublishedStructure.js";

for (const expectation of JsonReportKeepsPublishedStructure.EXPECTATIONS) {
    test("the " + expectation.name + " object has exactly the published keys in the published order", () => {
        const rendered = JsonReportKeepsPublishedStructure.render([JsonReportKeepsPublishedStructure.fullFinding()]);

        assert.deepEqual(JsonReportKeepsPublishedStructure.keysOf(rendered, expectation.name), expectation.keys);
    });
}

test("schema_version is 1 until a change that removes or renames a field in the report", () => {
    const rendered = JsonReportKeepsPublishedStructure.render([]);

    assert.equal(rendered.schema_version, JsonReportKeepsPublishedStructure.SCHEMA_VERSION);
});

test("a finding without path, pack, or location omits those keys instead of writing null", () => {
    const rendered = JsonReportKeepsPublishedStructure.render([JsonReportKeepsPublishedStructure.bareFinding()]);

    assert.deepEqual(JsonReportKeepsPublishedStructure.keysOf(rendered, "finding"), ["id", "slug", "severity", "message"]);
});
