import assert from "node:assert/strict";
import { test } from "node:test";
import FormatVersion1NotAllowedReportsBehaviorPackFormat1 from "../Helpers/FormatVersion1NotAllowedReportsBehaviorPackFormat1.js";

for (const entry of FormatVersion1NotAllowedReportsBehaviorPackFormat1.CASES) {
    test(FormatVersion1NotAllowedReportsBehaviorPackFormat1.ID + " " + entry.name, async () => {
        const result = await FormatVersion1NotAllowedReportsBehaviorPackFormat1.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
