import type { VanillaDimensionChunkDataReportsOverworldChunkKeyCase } from "../Types/VanillaDimensionChunkDataReportsOverworldChunkKeyTypes.js";
import VanillaDimensionChunkData from "../../src/Checks/Addon/VanillaDimensionChunkData.js";
import WorldLoader from "../../src/Loaders/WorldLoader.js";
import ModelFixture from "./Core/ModelFixture.js";
import ChunkKeys from "./World/ChunkKeys.js";
import DimensionWorld from "./World/DimensionWorld.js";
import LogWriter from "./World/LogWriter.js";

export default abstract class VanillaDimensionChunkDataReportsOverworldChunkKey {
    static readonly ID = "ADDON/704";
    static readonly WORLD = "Content/world_template/";
    static readonly CASES: readonly VanillaDimensionChunkDataReportsOverworldChunkKeyCase[] = [
        {
            name: "chunk key for dimension 1000 is a custom dimension",
            keys: [
                ChunkKeys.build({ x: 0, z: 0, dimension: WorldLoader.CUSTOM_DIMENSION_ID_START, tag: DimensionWorld.CHUNK_TAG_VERSION }),
            ],
            expectedDimensions: [],
        },
        {
            name: "BiomeData and scoreboard keys of chunk key length are not chunk keys",
            keys: [new TextEncoder().encode("BiomeData"), new TextEncoder().encode("scoreboard")],
            expectedDimensions: [],
        },
        {
            name: "chunk key without a dimension field is Overworld dimension 0",
            keys: [ChunkKeys.build({ x: 1, z: 2, tag: DimensionWorld.CHUNK_TAG_VERSION })],
            expectedDimensions: [0],
        },
        {
            name: "subchunk keys for dimensions 1 and 2 are the Nether and the End",
            keys: [
                ChunkKeys.build({ x: 1, z: 2, dimension: 1, tag: WorldLoader.CHUNK_TAG_SUB_CHUNK, subChunk: 0 }),
                ChunkKeys.build({ x: 1, z: 2, dimension: 2, tag: WorldLoader.CHUNK_TAG_SUB_CHUNK, subChunk: 3 }),
            ],
            expectedDimensions: [1, 2],
        },
    ];

    static async run(entry: VanillaDimensionChunkDataReportsOverworldChunkKeyCase): Promise<number[]> {
        const root = VanillaDimensionChunkDataReportsOverworldChunkKey.WORLD;
        const files = {
            [root + "manifest.json"]: ModelFixture.worldTemplateManifest(),
            [root + "level.dat"]: new Uint8Array(8),
            [root + "db/000005.log"]: LogWriter.write([entry.keys.map((key) => ({ key, value: new Uint8Array([0xab, 0xcd]) }))]),
        };
        const result = await ModelFixture.run(new VanillaDimensionChunkData(), files, { layout: "marketplace" });

        return result.findings.map((finding) => Number(/\((\d+)\)/.exec(finding.message)?.[1]));
    }
}
