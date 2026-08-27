import assert from "node:assert/strict";
import { test } from "node:test";
import NotInTextureListReportsUnlistedTexture from "../Helpers/NotInTextureListReportsUnlistedTexture.js";

for (const entry of NotInTextureListReportsUnlistedTexture.CASES) {
    test(NotInTextureListReportsUnlistedTexture.ID + " " + entry.name, async () => {
        const result = await NotInTextureListReportsUnlistedTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
