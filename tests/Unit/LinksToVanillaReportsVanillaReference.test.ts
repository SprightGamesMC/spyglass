import assert from "node:assert/strict";
import { test } from "node:test";
import LinksToVanillaReportsVanillaReference from "../Helpers/LinksToVanillaReportsVanillaReference.js";

for (const entry of LinksToVanillaReportsVanillaReference.CASES) {
    test(LinksToVanillaReportsVanillaReference.ID + " " + entry.name, async () => {
        const findings = await LinksToVanillaReportsVanillaReference.run(entry);

        assert.deepEqual(findings.map((finding) => finding.location?.field ?? "").sort(), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, LinksToVanillaReportsVanillaReference.ID);
            assert.equal(finding.severity, "recommendation");
            assert.equal(finding.path, "RP/entity/thing.entity.json");
        }
    });
}

test(LinksToVanillaReportsVanillaReference.ID + " excludes the texture content type where linking to vanilla is expected", () => {
    assert.deepEqual(LinksToVanillaReportsVanillaReference.excludedContentTypes(), ["texture"]);
});
