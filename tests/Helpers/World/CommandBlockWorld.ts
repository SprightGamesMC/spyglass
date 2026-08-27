import type { FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { CommandBlockCase } from "../../Types/World/CommandBlockFixtureTypes.js";
import type { LogEntry, NbtEntry } from "../../Types/World/WorldFixtureTypes.js";
import NbtReader from "../../../src/Loaders/NbtReader.js";
import WorldLoader from "../../../src/Loaders/WorldLoader.js";
import ChunkKeys from "./ChunkKeys.js";
import DimensionWorld from "./DimensionWorld.js";
import NbtWriter from "./NbtWriter.js";
import ByteUtilities from "../Core/ByteUtilities.js";

export default abstract class CommandBlockWorld {
    static files(entry: CommandBlockCase): FixtureFiles {
        return DimensionWorld.worldFiles([CommandBlockWorld.record(entry)]);
    }

    private static record(entry: CommandBlockCase): LogEntry {
        const commandEntries: NbtEntry[] = [NbtWriter.string("Command", entry.command)];

        if (entry.version !== undefined) {
            commandEntries.push(NbtWriter.int("Version", entry.version));
        }

        if (entry.source === "minecart") {
            const actorKey = ByteUtilities.concat([new TextEncoder().encode(WorldLoader.ACTOR_KEY_PREFIX), new Uint8Array(8)]);
            const root = [
                NbtWriter.string("identifier", WorldLoader.COMMAND_BLOCK_MINECART_IDENTIFIER),
                NbtWriter.list("Pos", NbtReader.TAG_FLOAT, [1.5, 64, 2.5]),
                ...commandEntries,
            ];

            return { key: actorKey, value: NbtWriter.root(root) };
        }

        const sign = [NbtWriter.string("id", "Sign"), NbtWriter.int("x", 1), NbtWriter.int("y", 64), NbtWriter.int("z", 1)];
        const block = [
            NbtWriter.string("id", WorldLoader.COMMAND_BLOCK_ID),
            NbtWriter.int("x", 3),
            NbtWriter.int("y", 64),
            NbtWriter.int("z", 4),
            ...commandEntries,
        ];

        return { key: ChunkKeys.build({ x: 0, z: 0, tag: WorldLoader.CHUNK_TAG_BLOCK_ENTITY }), value: NbtWriter.roots([sign, block]) };
    }
}
