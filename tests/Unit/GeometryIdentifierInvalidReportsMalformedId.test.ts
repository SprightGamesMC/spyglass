import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryIdentifierInvalidReportsMalformedId from "../Helpers/GeometryIdentifierInvalidReportsMalformedId.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of GeometryIdentifierInvalidReportsMalformedId.CASES) {
    test(GeometryIdentifierInvalidReportsMalformedId.ID + " " + entry.name, async () => {
        const findings = await GeometryIdentifierInvalidReportsMalformedId.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
