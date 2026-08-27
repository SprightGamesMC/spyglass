import assert from "node:assert/strict";
import { test } from "node:test";
import LockTemplateOptionsNotApplicableReportsNonWorldTemplate from "../Helpers/LockTemplateOptionsNotApplicableReportsNonWorldTemplate.js";

for (const entry of LockTemplateOptionsNotApplicableReportsNonWorldTemplate.CASES) {
    test(LockTemplateOptionsNotApplicableReportsNonWorldTemplate.ID + " " + entry.name, async () => {
        const result = await LockTemplateOptionsNotApplicableReportsNonWorldTemplate.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
