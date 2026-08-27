import assert from "node:assert/strict";
import { test } from "node:test";
import LanguagesJsonInvalidReportsNonStringList from "../Helpers/LanguagesJsonInvalidReportsNonStringList.js";

for (const entry of LanguagesJsonInvalidReportsNonStringList.CASES) {
    test(LanguagesJsonInvalidReportsNonStringList.ID + " " + entry.name, async () => {
        const result = await LanguagesJsonInvalidReportsNonStringList.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
