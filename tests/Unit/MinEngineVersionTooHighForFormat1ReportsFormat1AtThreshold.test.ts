import assert from "node:assert/strict";
import { test } from "node:test";
import MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold from "../Helpers/MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold.js";

for (const entry of MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold.CASES) {
    test(MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold.ID + " " + entry.name, async () => {
        const result = await MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
