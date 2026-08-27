import assert from "node:assert/strict";
import { test } from "node:test";
import SchemaInvalidReportsUnknownTopLevelKey from "../Helpers/SchemaInvalidReportsUnknownTopLevelKey.js";

for (const entry of SchemaInvalidReportsUnknownTopLevelKey.CASES) {
    test(SchemaInvalidReportsUnknownTopLevelKey.ID + " " + entry.name, async () => {
        const result = await SchemaInvalidReportsUnknownTopLevelKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
