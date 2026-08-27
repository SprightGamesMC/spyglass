import assert from "node:assert/strict";
import { test } from "node:test";
import DependencyIdentifierAmbiguousReportsModuleNameWithUuid from "../Helpers/DependencyIdentifierAmbiguousReportsModuleNameWithUuid.js";

for (const entry of DependencyIdentifierAmbiguousReportsModuleNameWithUuid.CASES) {
    test(DependencyIdentifierAmbiguousReportsModuleNameWithUuid.ID + " " + entry.name, async () => {
        const result = await DependencyIdentifierAmbiguousReportsModuleNameWithUuid.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
