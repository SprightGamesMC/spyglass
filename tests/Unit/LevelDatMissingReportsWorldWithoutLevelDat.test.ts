import assert from "node:assert/strict";
import { test } from "node:test";
import LevelDatMissingReportsWorldWithoutLevelDat from "../Helpers/LevelDatMissingReportsWorldWithoutLevelDat.js";

for (const entry of LevelDatMissingReportsWorldWithoutLevelDat.CASES) {
    test(LevelDatMissingReportsWorldWithoutLevelDat.ID + " " + entry.name, async () => {
        const findings = await LevelDatMissingReportsWorldWithoutLevelDat.run(entry);

        if (entry.expectedPath === undefined) {
            assert.deepEqual(findings, []);
            return;
        }

        assert.equal(findings.length, 1);
        assert.equal(findings[0].id, LevelDatMissingReportsWorldWithoutLevelDat.ID);
        assert.equal(findings[0].path, entry.expectedPath);
    });
}
