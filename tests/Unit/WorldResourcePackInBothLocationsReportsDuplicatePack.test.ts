import assert from "node:assert/strict";
import { test } from "node:test";
import WorldResourcePackInBothLocationsReportsDuplicatePack from "../Helpers/WorldResourcePackInBothLocationsReportsDuplicatePack.js";

for (const entry of WorldResourcePackInBothLocationsReportsDuplicatePack.CASES) {
    test(WorldResourcePackInBothLocationsReportsDuplicatePack.ID + " " + entry.name, async () => {
        const result = await WorldResourcePackInBothLocationsReportsDuplicatePack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
