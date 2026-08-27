import assert from "node:assert/strict";
import { test } from "node:test";
import MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease from "../Helpers/MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease.js";

for (const entry of MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease.CASES) {
    test(MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease.ID + " " + entry.name, async () => {
        const result = await MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
