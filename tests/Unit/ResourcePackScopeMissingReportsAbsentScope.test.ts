import assert from "node:assert/strict";
import { test } from "node:test";
import ResourcePackScopeMissingReportsAbsentScope from "../Helpers/ResourcePackScopeMissingReportsAbsentScope.js";

for (const entry of ResourcePackScopeMissingReportsAbsentScope.CASES) {
    test(ResourcePackScopeMissingReportsAbsentScope.ID + " " + entry.name, async () => {
        const result = await ResourcePackScopeMissingReportsAbsentScope.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
