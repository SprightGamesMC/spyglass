import assert from "node:assert/strict";
import { test } from "node:test";
import WorldTemplateMissingReportsAbsentWorldTemplateFolder from "../Helpers/WorldTemplateMissingReportsAbsentWorldTemplateFolder.js";

for (const entry of WorldTemplateMissingReportsAbsentWorldTemplateFolder.CASES) {
    test(WorldTemplateMissingReportsAbsentWorldTemplateFolder.ID + " " + entry.name, async () => {
        const result = await WorldTemplateMissingReportsAbsentWorldTemplateFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
