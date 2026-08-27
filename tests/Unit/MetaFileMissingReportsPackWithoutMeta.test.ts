import assert from "node:assert/strict";
import { test } from "node:test";
import MetaFileMissingReportsPackWithoutMeta from "../Helpers/MetaFileMissingReportsPackWithoutMeta.js";

for (const entry of MetaFileMissingReportsPackWithoutMeta.CASES) {
    test(MetaFileMissingReportsPackWithoutMeta.ID + " " + entry.name, async () => {
        const result = await MetaFileMissingReportsPackWithoutMeta.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
