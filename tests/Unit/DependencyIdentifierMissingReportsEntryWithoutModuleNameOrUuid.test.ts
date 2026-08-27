import assert from "node:assert/strict";
import { test } from "node:test";
import DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid from "../Helpers/DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid.js";

for (const entry of DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid.CASES) {
    test(DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid.ID + " " + entry.name, async () => {
        const result = await DependencyIdentifierMissingReportsEntryWithoutModuleNameOrUuid.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
