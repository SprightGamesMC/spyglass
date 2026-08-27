import assert from "node:assert/strict";
import { test } from "node:test";
import ModuleTypeInvalidReportsUnknownModuleType from "../Helpers/ModuleTypeInvalidReportsUnknownModuleType.js";

for (const entry of ModuleTypeInvalidReportsUnknownModuleType.CASES) {
    test(ModuleTypeInvalidReportsUnknownModuleType.ID + " " + entry.name, async () => {
        const result = await ModuleTypeInvalidReportsUnknownModuleType.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
