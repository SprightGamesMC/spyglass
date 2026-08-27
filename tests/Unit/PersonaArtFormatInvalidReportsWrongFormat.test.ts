import assert from "node:assert/strict";
import { test } from "node:test";
import PersonaArtFormatInvalidReportsWrongFormat from "../Helpers/PersonaArtFormatInvalidReportsWrongFormat.js";

for (const entry of PersonaArtFormatInvalidReportsWrongFormat.CASES) {
    test(PersonaArtFormatInvalidReportsWrongFormat.ID + " " + entry.name, async () => {
        const result = await PersonaArtFormatInvalidReportsWrongFormat.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
