import assert from "node:assert/strict";
import { test } from "node:test";
import DefinitionNameKeyMissingReportsDefinitionWithoutNameKey from "../Helpers/DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.js";

for (const entry of DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.CASES) {
    test(DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ID + " " + entry.name, async () => {
        const result = await DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
