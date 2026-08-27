import assert from "node:assert/strict";
import { test } from "node:test";
import TextureUnreferencedReportsUnnamedImage from "../Helpers/TextureUnreferencedReportsUnnamedImage.js";

for (const entry of TextureUnreferencedReportsUnnamedImage.CASES) {
    test(TextureUnreferencedReportsUnnamedImage.ID + " " + entry.name, async () => {
        const result = await TextureUnreferencedReportsUnnamedImage.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
