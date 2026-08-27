import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import MeshNotAllowedReportsBoneWithMesh from "../Helpers/MeshNotAllowedReportsBoneWithMesh.js";

for (const entry of MeshNotAllowedReportsBoneWithMesh.CASES) {
    test(MeshNotAllowedReportsBoneWithMesh.ID + " " + entry.name, async () => {
        const findings = await MeshNotAllowedReportsBoneWithMesh.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, MeshNotAllowedReportsBoneWithMesh.ID);
            assert.equal(finding.path, MeshNotAllowedReportsBoneWithMesh.PATH);
            assert.equal(finding.pack, "RP");
        }
    });
}
