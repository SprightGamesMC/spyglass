import assert from "node:assert/strict";
import { test } from "node:test";
import BaseGameVersionWildcardReportsStarValue from "../Helpers/BaseGameVersionWildcardReportsStarValue.js";
import WorldTemplateFixture from "../Helpers/World/WorldTemplateFixture.js";

for (const entry of BaseGameVersionWildcardReportsStarValue.CASES) {
    test(BaseGameVersionWildcardReportsStarValue.ID + " " + entry.name, async () => {
        const findings = await BaseGameVersionWildcardReportsStarValue.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, BaseGameVersionWildcardReportsStarValue.ID);
            assert.equal(finding.path, WorldTemplateFixture.MANIFEST_PATH);
            assert.equal(finding.pack, "World");
            assert.equal(finding.location?.field, "header.base_game_version");
        }
    });
}
