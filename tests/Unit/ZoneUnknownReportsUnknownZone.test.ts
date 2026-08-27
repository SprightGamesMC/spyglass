import assert from "node:assert/strict";
import { test } from "node:test";
import ZoneUnknownReportsUnknownZone from "../Helpers/ZoneUnknownReportsUnknownZone.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of ZoneUnknownReportsUnknownZone.CASES) {
    test(ZoneUnknownReportsUnknownZone.ID + " " + entry.name, async () => {
        const findings = await ZoneUnknownReportsUnknownZone.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
