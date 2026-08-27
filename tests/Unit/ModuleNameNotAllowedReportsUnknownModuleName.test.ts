import assert from "node:assert/strict";
import { test } from "node:test";
import ModuleNameNotAllowedReportsUnknownModuleName from "../Helpers/ModuleNameNotAllowedReportsUnknownModuleName.js";

for (const entry of ModuleNameNotAllowedReportsUnknownModuleName.CASES) {
    test(ModuleNameNotAllowedReportsUnknownModuleName.ID + " " + entry.name, async () => {
        const result = await ModuleNameNotAllowedReportsUnknownModuleName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
