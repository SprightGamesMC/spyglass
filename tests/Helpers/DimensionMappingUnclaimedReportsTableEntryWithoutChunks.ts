import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DimensionMappingUnclaimedReportsTableEntryWithoutChunksCase } from "../Types/DimensionMappingUnclaimedReportsTableEntryWithoutChunksTypes.js";
import DimensionMappingUnclaimed from "../../src/Checks/Chunk/DimensionMappingUnclaimed.js";
import ModelFixture from "./Core/ModelFixture.js";
import DimensionWorld from "./World/DimensionWorld.js";

export default abstract class DimensionMappingUnclaimedReportsTableEntryWithoutChunks {
    static readonly ID = "CHUNK/301";
    static readonly CASES: readonly DimensionMappingUnclaimedReportsTableEntryWithoutChunksCase[] = [
        { name: "table entry test:sky 1000 has chunk data", chunkDimensions: [1000], table: { "test:sky": 1000 }, expectedIds: [] },
        { name: "empty table has no entry to leave unclaimed", chunkDimensions: [1000], table: {}, expectedIds: [] },
        {
            name: "table entry for vanilla id 1 is below the custom dimension range so it is not checked",
            chunkDimensions: [1000],
            table: { "test:sky": 1000, "minecraft:nether": 1 },
            expectedIds: [],
        },
        {
            name: "table entry test:void 1001 has no chunk data",
            chunkDimensions: [1000],
            table: { "test:sky": 1000, "test:void": 1001 },
            expectedIds: ["CHUNK/301"],
        },
    ];

    static async run(entry: DimensionMappingUnclaimedReportsTableEntryWithoutChunksCase): Promise<Finding[]> {
        return ModelFixture.findings(new DimensionMappingUnclaimed(), DimensionWorld.files(entry), { contentType: "world" });
    }
}
