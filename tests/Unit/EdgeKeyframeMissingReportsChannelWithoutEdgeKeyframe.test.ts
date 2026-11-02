import assert from "node:assert/strict";
import { test } from "node:test";
import EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe from "../Helpers/EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe.CASES) {
    test(EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe.ID + " " + entry.name, async () => {
        const findings = await EdgeKeyframeMissingReportsChannelWithoutEdgeKeyframe.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
