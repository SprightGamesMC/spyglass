import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo from "../Helpers/GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo.CASES) {
    test(GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo.ID + " " + entry.name, async () => {
        const findings = await GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
