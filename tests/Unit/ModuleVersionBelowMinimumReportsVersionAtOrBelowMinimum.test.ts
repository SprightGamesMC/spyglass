import assert from "node:assert/strict";
import { test } from "node:test";
import ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum from "../Helpers/ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum.js";

for (const entry of ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum.CASES) {
    test(ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum.ID + " " + entry.name, async () => {
        const result = await ModuleVersionBelowMinimumReportsVersionAtOrBelowMinimum.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
