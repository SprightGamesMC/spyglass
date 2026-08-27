import assert from "node:assert/strict";
import { test } from "node:test";
import ModuleTypeMismatchReportsNonPersonaModule from "../Helpers/ModuleTypeMismatchReportsNonPersonaModule.js";

for (const entry of ModuleTypeMismatchReportsNonPersonaModule.CASES) {
    test(ModuleTypeMismatchReportsNonPersonaModule.ID + " " + entry.name, async () => {
        const result = await ModuleTypeMismatchReportsNonPersonaModule.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
