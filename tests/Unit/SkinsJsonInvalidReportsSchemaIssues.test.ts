import assert from "node:assert/strict";
import { test } from "node:test";
import SkinsJsonInvalidReportsSchemaIssues from "../Helpers/SkinsJsonInvalidReportsSchemaIssues.js";

for (const entry of SkinsJsonInvalidReportsSchemaIssues.CASES) {
    test(SkinsJsonInvalidReportsSchemaIssues.ID + " " + entry.name, async () => {
        const result = await SkinsJsonInvalidReportsSchemaIssues.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
