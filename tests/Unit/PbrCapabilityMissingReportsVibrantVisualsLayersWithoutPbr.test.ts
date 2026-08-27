import assert from "node:assert/strict";
import { test } from "node:test";
import PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr from "../Helpers/PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr.js";

for (const entry of PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr.CASES) {
    test(PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr.ID + " " + entry.name, async () => {
        const result = await PbrCapabilityMissingReportsVibrantVisualsLayersWithoutPbr.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
