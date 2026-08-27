import assert from "node:assert/strict";
import { test } from "node:test";
import ParticleIdentifierNotNamespacedReportsBareIdentifier from "../Helpers/ParticleIdentifierNotNamespacedReportsBareIdentifier.js";

for (const entry of ParticleIdentifierNotNamespacedReportsBareIdentifier.CASES) {
    test(ParticleIdentifierNotNamespacedReportsBareIdentifier.ID + " " + entry.name, async () => {
        const findings = await ParticleIdentifierNotNamespacedReportsBareIdentifier.run(entry.content);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, ParticleIdentifierNotNamespacedReportsBareIdentifier.ID);
            assert.equal(finding.path, ParticleIdentifierNotNamespacedReportsBareIdentifier.PATH);
            assert.equal(finding.pack, "RP");
            assert.equal(finding.location?.field, "particle_effect.description.identifier");
        }
    });
}
