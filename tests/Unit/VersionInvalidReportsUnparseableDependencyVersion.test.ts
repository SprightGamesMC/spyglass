import assert from "node:assert/strict";
import { test } from "node:test";
import VersionInvalidReportsUnparseableDependencyVersion from "../Helpers/VersionInvalidReportsUnparseableDependencyVersion.js";

for (const entry of VersionInvalidReportsUnparseableDependencyVersion.CASES) {
    test(VersionInvalidReportsUnparseableDependencyVersion.ID + " " + entry.name, async () => {
        const result = await VersionInvalidReportsUnparseableDependencyVersion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
