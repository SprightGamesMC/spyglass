import assert from "node:assert/strict";
import { test } from "node:test";
import TextureDuplicateReportsSharedTexture from "../Helpers/TextureDuplicateReportsSharedTexture.js";

for (const entry of TextureDuplicateReportsSharedTexture.CASES) {
    test(TextureDuplicateReportsSharedTexture.ID + " " + entry.name, async () => {
        const result = await TextureDuplicateReportsSharedTexture.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
