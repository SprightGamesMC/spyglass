import assert from "node:assert/strict";
import { test } from "node:test";
import UuidDuplicateReportsRepeatedHeaderUuid from "../Helpers/UuidDuplicateReportsRepeatedHeaderUuid.js";

for (const entry of UuidDuplicateReportsRepeatedHeaderUuid.CASES) {
    test(UuidDuplicateReportsRepeatedHeaderUuid.ID + " " + entry.name, async () => {
        const result = await UuidDuplicateReportsRepeatedHeaderUuid.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
