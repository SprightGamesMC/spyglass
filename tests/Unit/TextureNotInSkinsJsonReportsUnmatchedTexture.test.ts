import assert from "node:assert/strict";
import { test } from "node:test";
import TextureNotInSkinsJsonReportsUnmatchedTexture from "../Helpers/TextureNotInSkinsJsonReportsUnmatchedTexture.js";

for (const entry of TextureNotInSkinsJsonReportsUnmatchedTexture.CASES) {
    test(TextureNotInSkinsJsonReportsUnmatchedTexture.ID + " " + entry.name, async () => {
        const result = await TextureNotInSkinsJsonReportsUnmatchedTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
