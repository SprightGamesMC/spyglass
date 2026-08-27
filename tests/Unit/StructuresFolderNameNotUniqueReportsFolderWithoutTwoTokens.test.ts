import assert from "node:assert/strict";
import { test } from "node:test";
import StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens from "../Helpers/StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens.js";

for (const entry of StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens.CASES) {
    test(StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens.ID + " " + entry.name, async () => {
        const found = await StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}
