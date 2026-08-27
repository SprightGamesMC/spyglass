import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleDefinitionsFilesReportsSecondSoundDefinitions from "../Helpers/MultipleDefinitionsFilesReportsSecondSoundDefinitions.js";

for (const entry of MultipleDefinitionsFilesReportsSecondSoundDefinitions.CASES) {
    test(MultipleDefinitionsFilesReportsSecondSoundDefinitions.ID + " " + entry.name, async () => {
        const result = await MultipleDefinitionsFilesReportsSecondSoundDefinitions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
