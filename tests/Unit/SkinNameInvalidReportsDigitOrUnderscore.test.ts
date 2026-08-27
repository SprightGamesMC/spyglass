import assert from "node:assert/strict";
import { test } from "node:test";
import SkinNameInvalidReportsDigitOrUnderscore from "../Helpers/SkinNameInvalidReportsDigitOrUnderscore.js";

for (const entry of SkinNameInvalidReportsDigitOrUnderscore.CASES) {
    test(SkinNameInvalidReportsDigitOrUnderscore.ID + " " + entry.name, async () => {
        const result = await SkinNameInvalidReportsDigitOrUnderscore.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
