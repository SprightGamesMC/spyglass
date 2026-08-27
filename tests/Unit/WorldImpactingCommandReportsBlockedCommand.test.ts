import assert from "node:assert/strict";
import { test } from "node:test";
import WorldImpactingCommandReportsBlockedCommand from "../Helpers/WorldImpactingCommandReportsBlockedCommand.js";

for (const entry of WorldImpactingCommandReportsBlockedCommand.CASES) {
    test(WorldImpactingCommandReportsBlockedCommand.ID + " " + entry.name, async () => {
        const lines = await WorldImpactingCommandReportsBlockedCommand.run(entry);

        assert.deepEqual(lines, [...entry.expectedLines]);
    });
}
