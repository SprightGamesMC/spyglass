import assert from "node:assert/strict";
import { test } from "node:test";
import PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion from "../Helpers/PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion.js";

for (const entry of PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion.CASES) {
    test(PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion.ID + " " + entry.name, async () => {
        const result = await PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
