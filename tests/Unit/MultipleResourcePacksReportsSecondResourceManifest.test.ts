import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleResourcePacksReportsSecondResourceManifest from "../Helpers/MultipleResourcePacksReportsSecondResourceManifest.js";

for (const entry of MultipleResourcePacksReportsSecondResourceManifest.CASES) {
    test(MultipleResourcePacksReportsSecondResourceManifest.ID + " " + entry.name, async () => {
        const result = await MultipleResourcePacksReportsSecondResourceManifest.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
