import assert from "node:assert/strict";
import { test } from "node:test";
import StoreArtDpiInvalidReportsWrongDensity from "../Helpers/StoreArtDpiInvalidReportsWrongDensity.js";

for (const entry of StoreArtDpiInvalidReportsWrongDensity.CASES) {
    test(StoreArtDpiInvalidReportsWrongDensity.ID + " " + entry.name, async () => {
        const result = await StoreArtDpiInvalidReportsWrongDensity.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
