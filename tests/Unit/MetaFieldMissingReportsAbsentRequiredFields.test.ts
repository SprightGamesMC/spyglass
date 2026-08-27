import assert from "node:assert/strict";
import { test } from "node:test";
import MetaFieldMissingReportsAbsentRequiredFields from "../Helpers/MetaFieldMissingReportsAbsentRequiredFields.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of MetaFieldMissingReportsAbsentRequiredFields.CASES) {
    test(MetaFieldMissingReportsAbsentRequiredFields.ID + " " + entry.name, async () => {
        const findings = await MetaFieldMissingReportsAbsentRequiredFields.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
