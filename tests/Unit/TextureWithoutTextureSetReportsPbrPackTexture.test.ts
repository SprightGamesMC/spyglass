import assert from "node:assert/strict";
import { test } from "node:test";
import TextureWithoutTextureSetReportsPbrPackTexture from "../Helpers/TextureWithoutTextureSetReportsPbrPackTexture.js";

for (const entry of TextureWithoutTextureSetReportsPbrPackTexture.CASES) {
    test(TextureWithoutTextureSetReportsPbrPackTexture.ID + " " + entry.name, async () => {
        const result = await TextureWithoutTextureSetReportsPbrPackTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
