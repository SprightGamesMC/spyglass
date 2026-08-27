import assert from "node:assert/strict";
import { test } from "node:test";
import LangFileMissingReportsListedCodeWithoutFile from "../Helpers/LangFileMissingReportsListedCodeWithoutFile.js";

for (const entry of LangFileMissingReportsListedCodeWithoutFile.CASES) {
    test(LangFileMissingReportsListedCodeWithoutFile.ID + " " + entry.name, async () => {
        const result = await LangFileMissingReportsListedCodeWithoutFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
