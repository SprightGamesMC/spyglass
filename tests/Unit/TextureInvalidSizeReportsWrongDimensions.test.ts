import assert from "node:assert/strict";
import { test } from "node:test";
import TextureInvalidSizeReportsWrongDimensions from "../Helpers/TextureInvalidSizeReportsWrongDimensions.js";

for (const entry of TextureInvalidSizeReportsWrongDimensions.CASES) {
    test(TextureInvalidSizeReportsWrongDimensions.ID + " " + entry.name, async () => {
        const result = await TextureInvalidSizeReportsWrongDimensions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
