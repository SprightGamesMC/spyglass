import assert from "node:assert/strict";
import { test } from "node:test";
import TextureFormatInvalidReportsNonPngOrTga from "../Helpers/TextureFormatInvalidReportsNonPngOrTga.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of TextureFormatInvalidReportsNonPngOrTga.CASES) {
    test(TextureFormatInvalidReportsNonPngOrTga.ID + " " + entry.name, async () => {
        const findings = await TextureFormatInvalidReportsNonPngOrTga.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
