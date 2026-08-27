import assert from "node:assert/strict";
import { test } from "node:test";
import PieceIdInvalidReportsNonGuid from "../Helpers/PieceIdInvalidReportsNonGuid.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of PieceIdInvalidReportsNonGuid.CASES) {
    test(PieceIdInvalidReportsNonGuid.ID + " " + entry.name, async () => {
        const findings = await PieceIdInvalidReportsNonGuid.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
