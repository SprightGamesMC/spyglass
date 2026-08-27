import assert from "node:assert/strict";
import { test } from "node:test";
import TextureSetInTextureListReportsListedCompanion from "../Helpers/TextureSetInTextureListReportsListedCompanion.js";

for (const entry of TextureSetInTextureListReportsListedCompanion.CASES) {
    test(TextureSetInTextureListReportsListedCompanion.ID + " " + entry.name, async () => {
        const result = await TextureSetInTextureListReportsListedCompanion.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
