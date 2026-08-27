import assert from "node:assert/strict";
import { test } from "node:test";
import PieceTypeUnknownReportsUnknownType from "../Helpers/PieceTypeUnknownReportsUnknownType.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of PieceTypeUnknownReportsUnknownType.CASES) {
    test(PieceTypeUnknownReportsUnknownType.ID + " " + entry.name, async () => {
        const findings = await PieceTypeUnknownReportsUnknownType.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
