import assert from "node:assert/strict";
import { test } from "node:test";
import TooManyTextureHandlesReportsOverLimit from "../Helpers/TooManyTextureHandlesReportsOverLimit.js";

for (const entry of TooManyTextureHandlesReportsOverLimit.CASES) {
    test(TooManyTextureHandlesReportsOverLimit.ID + " " + entry.name, async () => {
        const result = await TooManyTextureHandlesReportsOverLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
    });
}
