import assert from "node:assert/strict";
import { test } from "node:test";
import DependencyNotFoundReportsUnmatchedUuid from "../Helpers/DependencyNotFoundReportsUnmatchedUuid.js";

for (const entry of DependencyNotFoundReportsUnmatchedUuid.CASES) {
    test(DependencyNotFoundReportsUnmatchedUuid.ID + " " + entry.name, async () => {
        const result = await DependencyNotFoundReportsUnmatchedUuid.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
