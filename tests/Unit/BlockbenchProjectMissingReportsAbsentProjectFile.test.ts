import assert from "node:assert/strict";
import { test } from "node:test";
import BlockbenchProjectMissingReportsAbsentProjectFile from "../Helpers/BlockbenchProjectMissingReportsAbsentProjectFile.js";

for (const entry of BlockbenchProjectMissingReportsAbsentProjectFile.CASES) {
    test(BlockbenchProjectMissingReportsAbsentProjectFile.ID + " " + entry.name, async () => {
        const result = await BlockbenchProjectMissingReportsAbsentProjectFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
