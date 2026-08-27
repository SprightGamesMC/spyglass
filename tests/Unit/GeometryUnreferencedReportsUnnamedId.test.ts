import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryUnreferencedReportsUnnamedId from "../Helpers/GeometryUnreferencedReportsUnnamedId.js";

for (const entry of GeometryUnreferencedReportsUnnamedId.CASES) {
    test(GeometryUnreferencedReportsUnnamedId.ID + " " + entry.name, async () => {
        const result = await GeometryUnreferencedReportsUnnamedId.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
