import assert from "node:assert/strict";
import { test } from "node:test";
import HeaderFieldMissingReportsAbsentDescription from "../Helpers/HeaderFieldMissingReportsAbsentDescription.js";

for (const entry of HeaderFieldMissingReportsAbsentDescription.CASES) {
    test(HeaderFieldMissingReportsAbsentDescription.ID + " " + entry.name, async () => {
        const result = await HeaderFieldMissingReportsAbsentDescription.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
