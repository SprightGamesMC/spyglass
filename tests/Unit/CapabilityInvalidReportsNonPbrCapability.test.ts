import assert from "node:assert/strict";
import { test } from "node:test";
import CapabilityInvalidReportsNonPbrCapability from "../Helpers/CapabilityInvalidReportsNonPbrCapability.js";

for (const entry of CapabilityInvalidReportsNonPbrCapability.CASES) {
    test(CapabilityInvalidReportsNonPbrCapability.ID + " " + entry.name, async () => {
        const result = await CapabilityInvalidReportsNonPbrCapability.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
