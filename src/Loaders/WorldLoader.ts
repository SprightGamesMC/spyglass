import type { CheckContext } from "../Types/CheckTypes.js";
import type { ContentItem, World } from "../Types/ModelTypes.js";
import type { CommandBlockRecord, LevelDatReadResult, LevelDbRecords, NbtCompound, NbtValue, WorldData } from "../Types/WorldTypes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import LevelDbReader from "./LevelDbReader.js";
import NbtReader from "./NbtReader.js";

export default abstract class WorldLoader {
    static readonly DIMENSION_TABLE_KEY = "DimensionNameIdTable";
    static readonly ACTOR_KEY_PREFIX = "actorprefix";
    static readonly COMMAND_BLOCK_ID = "CommandBlock";
    static readonly COMMAND_BLOCK_MINECART_IDENTIFIER = "minecraft:command_block_minecart";
    static readonly CUSTOM_DIMENSION_ID_START = 1000;
    static readonly CHUNK_TAG_SUB_CHUNK = 47;
    static readonly CHUNK_TAG_BLOCK_ENTITY = 49;
    private static readonly CHUNK_KEY_LENGTHS: readonly number[] = [9, 10, 13, 14];
    private static readonly CHUNK_KEY_WITH_DIMENSION_LENGTH = 13;
    private static readonly CHUNK_KEY_DIMENSION_OFFSET = 8;
    private static readonly CHUNK_KEY_TAG_OFFSET = 8;
    private static readonly CHUNK_KEY_TAG_OFFSET_WITH_DIMENSION = 12;
    private static readonly CHUNK_KEY_SUB_CHUNK_INDEX_LENGTH = 1;
    private static readonly CHUNK_TAG_LEGACY_VERSION = 118;
    private static readonly CHUNK_TAG_MINIMUM = 43;
    private static readonly CHUNK_TAG_MAXIMUM = 65;
    private static readonly CACHE_KEY_PREFIX = "world-data:";

    static load(context: CheckContext, world: World): Promise<WorldData> {
        return context.loaders.cached(WorldLoader.CACHE_KEY_PREFIX + world.root, () => WorldLoader.collect(context, world));
    }

    private static async collect(context: CheckContext, world: World): Promise<WorldData> {
        const levelDatItem = WorldLoader.findLevelDat(world);
        const levelDatResult = await WorldLoader.readLevelDat(context, levelDatItem);
        const records = await WorldLoader.readDatabase(context, world);
        const dimensionTableBytes = records.get(WorldLoader.DIMENSION_TABLE_KEY);
        const chunkDimensionIds = new Set<number>();
        const commandBlocks: CommandBlockRecord[] = [];

        for (const [key, value] of records) {
            WorldLoader.collectFromRecord(key, value, chunkDimensionIds, commandBlocks);
        }

        return {
            levelDatPath: levelDatItem?.path,
            levelDat: levelDatResult.value,
            levelDatUnparseable: levelDatResult.unparseable,
            hasDimensionTable: dimensionTableBytes !== undefined,
            dimensionTable: WorldLoader.parseDimensionTable(dimensionTableBytes),
            chunkDimensionIds,
            commandBlocks,
        };
    }

    private static findLevelDat(world: World): ContentItem | undefined {
        return world.items.find((item) => item.kind === "level_dat") ?? world.items.find((item) => item.kind === "level_dat_old");
    }

    private static async readLevelDat(context: CheckContext, item: ContentItem | undefined): Promise<LevelDatReadResult> {
        if (item === undefined) {
            return { unparseable: false };
        }

        const bytes = await WorldLoader.readBytes(context, item.path);

        if (bytes === undefined) {
            return { unparseable: false };
        }

        try {
            return { value: NbtReader.readLevelDat(bytes), unparseable: false };
        } catch {
            return { unparseable: true };
        }
    }

    private static async readDatabase(context: CheckContext, world: World): Promise<LevelDbRecords> {
        const databaseItems = world.items
            .filter((item) => item.kind === "database")
            .sort((left, right) => left.path.localeCompare(right.path));
        const tables = databaseItems.filter((item) => PathUtilities.extension(item.path) === "ldb");
        const logs = databaseItems.filter((item) => PathUtilities.extension(item.path) === "log");
        const records: LevelDbRecords = new Map();

        for (const item of tables) {
            await WorldLoader.readDatabaseFile(context, item.path, records, LevelDbReader.readTable);
        }

        for (const item of logs) {
            await WorldLoader.readDatabaseFile(context, item.path, records, LevelDbReader.readLog);
        }

        return records;
    }

    private static async readDatabaseFile(
        context: CheckContext,
        path: string,
        records: LevelDbRecords,
        parse: (bytes: Uint8Array, records: LevelDbRecords) => void
    ): Promise<void> {
        const bytes = await WorldLoader.readBytes(context, path);

        if (bytes === undefined) {
            return;
        }

        try {
            parse(bytes, records);
        } catch {
            return;
        }
    }

    private static async readBytes(context: CheckContext, path: string): Promise<Uint8Array | undefined> {
        try {
            return await context.model.storage.readBytes(path);
        } catch {
            return undefined;
        }
    }

    private static parseDimensionTable(bytes: Uint8Array | undefined): Map<string, number> {
        const table = new Map<string, number>();

        if (bytes === undefined || bytes.length === 0) {
            return table;
        }

        let root: NbtCompound;

        try {
            root = NbtReader.readFirstRoot(bytes);
        } catch {
            return table;
        }

        for (const [name, value] of Object.entries(root)) {
            const id = NbtReader.asNumber(value);

            if (id !== undefined) {
                table.set(name, id);
            }
        }

        return table;
    }

    private static collectFromRecord(key: string, value: Uint8Array, dimensionIds: Set<number>, commandBlocks: CommandBlockRecord[]): void {
        if (key.startsWith(WorldLoader.ACTOR_KEY_PREFIX)) {
            WorldLoader.collectActorCommandBlock(value, commandBlocks);
            return;
        }

        if (!WorldLoader.CHUNK_KEY_LENGTHS.includes(key.length)) {
            return;
        }

        const bytes = LevelDbReader.bytesOf(key);
        const hasDimension = bytes.length >= WorldLoader.CHUNK_KEY_WITH_DIMENSION_LENGTH;
        const tagOffset = hasDimension ? WorldLoader.CHUNK_KEY_TAG_OFFSET_WITH_DIMENSION : WorldLoader.CHUNK_KEY_TAG_OFFSET;
        const tag = bytes[tagOffset];
        const hasSubChunkIndex = bytes.length === tagOffset + 1 + WorldLoader.CHUNK_KEY_SUB_CHUNK_INDEX_LENGTH;

        if (!WorldLoader.isChunkTag(tag, hasSubChunkIndex)) {
            return;
        }

        dimensionIds.add(hasDimension ? LevelDbReader.readUint32(bytes, WorldLoader.CHUNK_KEY_DIMENSION_OFFSET) : 0);

        if (tag === WorldLoader.CHUNK_TAG_BLOCK_ENTITY) {
            WorldLoader.collectBlockEntityCommandBlocks(value, commandBlocks);
        }
    }

    private static isChunkTag(tag: number, hasSubChunkIndex: boolean): boolean {
        if (hasSubChunkIndex) {
            return tag === WorldLoader.CHUNK_TAG_SUB_CHUNK;
        }

        if (tag === WorldLoader.CHUNK_TAG_LEGACY_VERSION) {
            return true;
        }

        return tag >= WorldLoader.CHUNK_TAG_MINIMUM && tag <= WorldLoader.CHUNK_TAG_MAXIMUM && tag !== WorldLoader.CHUNK_TAG_SUB_CHUNK;
    }

    private static collectBlockEntityCommandBlocks(value: Uint8Array, commandBlocks: CommandBlockRecord[]): void {
        let roots: NbtCompound[];

        try {
            roots = NbtReader.readRoots(value);
        } catch {
            return;
        }

        for (const root of roots) {
            if (NbtReader.asString(root.id) !== WorldLoader.COMMAND_BLOCK_ID) {
                continue;
            }

            const location = [root.x, root.y, root.z].map((coordinate) => String(NbtReader.asNumber(coordinate) ?? "?")).join(", ");

            commandBlocks.push(WorldLoader.commandBlockRecord(root, "block at " + location));
        }
    }

    private static collectActorCommandBlock(value: Uint8Array, commandBlocks: CommandBlockRecord[]): void {
        let root: NbtCompound;

        try {
            root = NbtReader.readFirstRoot(value);
        } catch {
            return;
        }

        if (NbtReader.asString(root.identifier) !== WorldLoader.COMMAND_BLOCK_MINECART_IDENTIFIER) {
            return;
        }

        commandBlocks.push(WorldLoader.commandBlockRecord(root, "minecart at " + WorldLoader.formatPosition(root.Pos)));
    }

    private static commandBlockRecord(root: NbtCompound, location: string): CommandBlockRecord {
        return {
            command: NbtReader.asString(root.Command) ?? "",
            version: NbtReader.asNumber(root.Version),
            location,
        };
    }

    private static formatPosition(position: NbtValue | undefined): string {
        if (!Array.isArray(position)) {
            return "?";
        }

        return position.map((coordinate) => String(Math.round(NbtReader.asNumber(coordinate) ?? 0))).join(", ");
    }
}
