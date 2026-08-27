import assert from "node:assert/strict";
import { test } from "node:test";
import WorldPackReferenceMismatchReportsDifferentVersion from "../Helpers/WorldPackReferenceMismatchReportsDifferentVersion.js";

for (const entry of WorldPackReferenceMismatchReportsDifferentVersion.CASES) {
    test(WorldPackReferenceMismatchReportsDifferentVersion.ID + " " + entry.name, async () => {
        const result = await WorldPackReferenceMismatchReportsDifferentVersion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
