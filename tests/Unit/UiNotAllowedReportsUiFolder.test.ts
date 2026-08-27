import assert from "node:assert/strict";
import { test } from "node:test";
import UiNotAllowedReportsUiFolder from "../Helpers/UiNotAllowedReportsUiFolder.js";

for (const entry of UiNotAllowedReportsUiFolder.CASES) {
    test(UiNotAllowedReportsUiFolder.ID + " " + entry.name, async () => {
        const result = await UiNotAllowedReportsUiFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
