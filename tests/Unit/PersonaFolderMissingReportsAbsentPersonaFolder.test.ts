import assert from "node:assert/strict";
import { test } from "node:test";
import PersonaFolderMissingReportsAbsentPersonaFolder from "../Helpers/PersonaFolderMissingReportsAbsentPersonaFolder.js";

for (const entry of PersonaFolderMissingReportsAbsentPersonaFolder.CASES) {
    test(PersonaFolderMissingReportsAbsentPersonaFolder.ID + " " + entry.name, async () => {
        const result = await PersonaFolderMissingReportsAbsentPersonaFolder.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
