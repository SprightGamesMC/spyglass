import assert from "node:assert/strict";
import { test } from "node:test";
import DeprecatedTextureReportsSmithingTableFiles from "../Helpers/DeprecatedTextureReportsSmithingTableFiles.js";

for (const entry of DeprecatedTextureReportsSmithingTableFiles.CASES) {
    test(DeprecatedTextureReportsSmithingTableFiles.ID + " " + entry.name, async () => {
        const result = await DeprecatedTextureReportsSmithingTableFiles.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
