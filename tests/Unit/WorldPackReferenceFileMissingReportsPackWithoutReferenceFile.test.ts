import assert from "node:assert/strict";
import { test } from "node:test";
import WorldPackReferenceFileMissingReportsPackWithoutReferenceFile from "../Helpers/WorldPackReferenceFileMissingReportsPackWithoutReferenceFile.js";

for (const entry of WorldPackReferenceFileMissingReportsPackWithoutReferenceFile.CASES) {
    test(WorldPackReferenceFileMissingReportsPackWithoutReferenceFile.ID + " " + entry.name, async () => {
        const result = await WorldPackReferenceFileMissingReportsPackWithoutReferenceFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
