import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DimensionTableMissingReportsCustomDimensionChunksCase } from "../Types/DimensionTableMissingReportsCustomDimensionChunksTypes.js";
import DimensionTableMissing from "../../src/Checks/Chunk/DimensionTableMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import DimensionWorld from "./World/DimensionWorld.js";

export default abstract class DimensionTableMissingReportsCustomDimensionChunks {
    static readonly ID = "CHUNK/101";
    static readonly CASES: readonly DimensionTableMissingReportsCustomDimensionChunksCase[] = [
        { name: "overworld chunks only need no DimensionNameIdTable", chunkDimensions: [undefined, 0], expectedIds: [] },
        { name: "nether dimension 1 is vanilla and needs no DimensionNameIdTable", chunkDimensions: [1], expectedIds: [] },
        {
            name: "custom dimension 1000 chunks with a DimensionNameIdTable are listed",
            chunkDimensions: [1000],
            table: { "test:sky": 1000 },
            expectedIds: [],
        },
        {
            name: "custom dimension 1000 and 1001 chunks with no DimensionNameIdTable have no table",
            chunkDimensions: [1000, 1001],
            expectedIds: ["CHUNK/101"],
        },
    ];

    static async run(entry: DimensionTableMissingReportsCustomDimensionChunksCase): Promise<Finding[]> {
        return ModelFixture.findings(new DimensionTableMissing(), DimensionWorld.files(entry), { contentType: "world" });
    }
}
