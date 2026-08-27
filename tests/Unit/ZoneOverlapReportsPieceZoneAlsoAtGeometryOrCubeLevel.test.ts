import assert from "node:assert/strict";
import { test } from "node:test";
import ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel from "../Helpers/ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel.CASES) {
    test(ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel.ID + " " + entry.name, async () => {
        const findings = await ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
