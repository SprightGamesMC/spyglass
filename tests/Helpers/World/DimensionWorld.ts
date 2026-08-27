import type { FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { DimensionCase } from "../../Types/World/DimensionFixtureTypes.js";
import type { LogEntry } from "../../Types/World/WorldFixtureTypes.js";
import WorldLoader from "../../../src/Loaders/WorldLoader.js";
import ChunkKeys from "./ChunkKeys.js";
import LogWriter from "./LogWriter.js";
import NbtWriter from "./NbtWriter.js";

export default abstract class DimensionWorld {
    static readonly ROOT = "World";
    static readonly CHUNK_TAG_VERSION = 44;

    static files(entry: DimensionCase): FixtureFiles {
        const records: LogEntry[] = entry.chunkDimensions.map((dimension, index) => ({
            key: ChunkKeys.build({ x: index, z: 0, dimension, tag: DimensionWorld.CHUNK_TAG_VERSION }),
            value: new Uint8Array([40]),
        }));

        records.push({
            key: ChunkKeys.build({ x: 0, z: 0, dimension: entry.chunkDimensions[0], tag: WorldLoader.CHUNK_TAG_SUB_CHUNK, subChunk: 0 }),
            value: new Uint8Array([9]),
        });
        records.push({ key: "scoreboard", value: new Uint8Array([0]) });

        if (entry.table !== undefined) {
            const entries = Object.entries(entry.table).map(([name, id]) => NbtWriter.int(name, id));

            records.push({ key: WorldLoader.DIMENSION_TABLE_KEY, value: NbtWriter.root(entries) });
        }

        return DimensionWorld.worldFiles(records);
    }

    static worldFiles(records: readonly LogEntry[]): FixtureFiles {
        return {
            [DimensionWorld.ROOT + "/level.dat"]: NbtWriter.levelDat([NbtWriter.string("LevelName", "Test")]),
            [DimensionWorld.ROOT + "/db/CURRENT"]: "MANIFEST-000002\n",
            [DimensionWorld.ROOT + "/db/000003.log"]: LogWriter.write([[...records]]),
        };
    }
}
