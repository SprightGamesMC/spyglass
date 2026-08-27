import assert from "node:assert/strict";
import { test } from "node:test";
import VanillaDimensionChunkDataReportsOverworldChunkKey from "../Helpers/VanillaDimensionChunkDataReportsOverworldChunkKey.js";

for (const entry of VanillaDimensionChunkDataReportsOverworldChunkKey.CASES) {
    test(VanillaDimensionChunkDataReportsOverworldChunkKey.ID + " " + entry.name, async () => {
        const dimensions = await VanillaDimensionChunkDataReportsOverworldChunkKey.run(entry);

        assert.deepEqual(dimensions, [...entry.expectedDimensions]);
    });
}
