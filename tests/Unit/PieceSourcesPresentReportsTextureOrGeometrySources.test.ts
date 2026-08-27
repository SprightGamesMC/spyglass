import assert from "node:assert/strict";
import { test } from "node:test";
import PieceSourcesPresentReportsTextureOrGeometrySources from "../Helpers/PieceSourcesPresentReportsTextureOrGeometrySources.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of PieceSourcesPresentReportsTextureOrGeometrySources.CASES) {
    test(PieceSourcesPresentReportsTextureOrGeometrySources.ID + " " + entry.name, async () => {
        const findings = await PieceSourcesPresentReportsTextureOrGeometrySources.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
