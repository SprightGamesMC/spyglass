import assert from "node:assert/strict";
import { test } from "node:test";
import CapabilitiesOnBehaviorPackReportsDeclaredCapabilities from "../Helpers/CapabilitiesOnBehaviorPackReportsDeclaredCapabilities.js";

for (const entry of CapabilitiesOnBehaviorPackReportsDeclaredCapabilities.CASES) {
    test(CapabilitiesOnBehaviorPackReportsDeclaredCapabilities.ID + " " + entry.name, async () => {
        const result = await CapabilitiesOnBehaviorPackReportsDeclaredCapabilities.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
