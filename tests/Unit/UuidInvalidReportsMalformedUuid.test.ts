import assert from "node:assert/strict";
import { test } from "node:test";
import UuidInvalidReportsMalformedUuid from "../Helpers/UuidInvalidReportsMalformedUuid.js";

for (const entry of UuidInvalidReportsMalformedUuid.CASES) {
    test(UuidInvalidReportsMalformedUuid.ID + " " + entry.name, async () => {
        const result = await UuidInvalidReportsMalformedUuid.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
