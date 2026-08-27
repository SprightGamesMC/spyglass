import assert from "node:assert/strict";
import { test } from "node:test";
import LangFileNotInCatalogReportsUnlistedLangFile from "../Helpers/LangFileNotInCatalogReportsUnlistedLangFile.js";

for (const entry of LangFileNotInCatalogReportsUnlistedLangFile.CASES) {
    test(LangFileNotInCatalogReportsUnlistedLangFile.ID + " " + entry.name, async () => {
        const result = await LangFileNotInCatalogReportsUnlistedLangFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
