import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleWorldTemplateModulesReportsSecondWorldTemplateModule from "../Helpers/MultipleWorldTemplateModulesReportsSecondWorldTemplateModule.js";

for (const entry of MultipleWorldTemplateModulesReportsSecondWorldTemplateModule.CASES) {
    test(MultipleWorldTemplateModulesReportsSecondWorldTemplateModule.ID + " " + entry.name, async () => {
        const result = await MultipleWorldTemplateModulesReportsSecondWorldTemplateModule.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
