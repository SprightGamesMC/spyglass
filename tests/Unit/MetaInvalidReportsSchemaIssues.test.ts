import assert from "node:assert/strict";
import { test } from "node:test";
import MetaInvalidReportsSchemaIssues from "../Helpers/MetaInvalidReportsSchemaIssues.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of MetaInvalidReportsSchemaIssues.CASES) {
    test(MetaInvalidReportsSchemaIssues.ID + " " + entry.name, async () => {
        const findings = await MetaInvalidReportsSchemaIssues.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
