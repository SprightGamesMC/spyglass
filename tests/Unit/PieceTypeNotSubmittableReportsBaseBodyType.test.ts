import assert from "node:assert/strict";
import { test } from "node:test";
import PieceTypeNotSubmittableReportsBaseBodyType from "../Helpers/PieceTypeNotSubmittableReportsBaseBodyType.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of PieceTypeNotSubmittableReportsBaseBodyType.CASES) {
    test(PieceTypeNotSubmittableReportsBaseBodyType.ID + " " + entry.name, async () => {
        const findings = await PieceTypeNotSubmittableReportsBaseBodyType.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
