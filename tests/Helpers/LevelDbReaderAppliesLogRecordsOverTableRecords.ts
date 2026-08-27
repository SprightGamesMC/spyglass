import type { LevelDbRecords } from "../../src/Types/WorldTypes.js";
import type { LevelDbReaderCase } from "../Types/LevelDbReaderAppliesLogRecordsOverTableRecordsTypes.js";
import type { LogEntry, TableEntry, TableOptions } from "../Types/World/WorldFixtureTypes.js";
import zlib from "node:zlib";
import LevelDbReader from "../../src/Loaders/LevelDbReader.js";
import ByteUtilities from "./Core/ByteUtilities.js";
import LogWriter from "./World/LogWriter.js";

export default abstract class LevelDbReaderAppliesLogRecordsOverTableRecords {
    static readonly CASES: readonly LevelDbReaderCase[] = [
        {
            name: "raw zlib table records are overridden by later log records",
            compression: LevelDbReader.COMPRESSION_ZLIB_RAW,
            splitLog: false,
            expected: { b: "log-b", c: "table-c", d: "log-d" },
        },
        {
            name: "zlib table records are overridden by later log records",
            compression: LevelDbReader.COMPRESSION_ZLIB,
            splitLog: false,
            expected: { b: "log-b", c: "table-c", d: "log-d" },
        },
        {
            name: "uncompressed table records are overridden by later log records",
            compression: LevelDbReader.COMPRESSION_NONE,
            splitLog: false,
            expected: { b: "log-b", c: "table-c", d: "log-d" },
        },
        {
            name: "log record split across blocks is reassembled and overrides the table",
            compression: LevelDbReader.COMPRESSION_NONE,
            splitLog: true,
            expected: { b: "log-b", c: "table-c", d: "log-d" },
        },
    ];

    static run(entry: LevelDbReaderCase): Record<string, string> {
        const records: LevelDbRecords = new Map();
        const table = LevelDbReaderAppliesLogRecordsOverTableRecords.writeTable(
            [
                { key: "a", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("table-a"), sequence: 1 },
                { key: "b", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("table-b"), sequence: 2 },
                { key: "c", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("table-c"), sequence: 3 },
                { key: "x", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("table-x"), sequence: 4 },
                { key: "x", sequence: 5 },
            ],
            { compression: entry.compression }
        );
        const logEntries: LogEntry[] = [
            { key: "a" },
            { key: "b", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("log-b") },
            { key: "d", value: LevelDbReaderAppliesLogRecordsOverTableRecords.bytes("log-d") },
        ];
        const log = entry.splitLog ? LogWriter.writeSplit(logEntries) : LogWriter.write([logEntries]);

        LevelDbReader.readTable(table, records);
        LevelDbReader.readLog(log, records);

        const result: Record<string, string> = {};

        for (const [key, value] of records) {
            result[key] = new TextDecoder().decode(value);
        }

        return result;
    }

    private static bytes(text: string): Uint8Array {
        return new TextEncoder().encode(text);
    }

    private static writeTable(
        entries: readonly TableEntry[],
        options: TableOptions = { compression: LevelDbReader.COMPRESSION_ZLIB_RAW }
    ): Uint8Array {
        const dataBlock = LevelDbReaderAppliesLogRecordsOverTableRecords.block(
            entries.map((entry) => ({
                key: LevelDbReaderAppliesLogRecordsOverTableRecords.internalKey(entry),
                value: entry.value ?? new Uint8Array(0),
            }))
        );
        const parts: Uint8Array[] = [];
        let offset = 0;

        const dataStored = LevelDbReaderAppliesLogRecordsOverTableRecords.store(dataBlock, options.compression);
        const dataHandle = LevelDbReaderAppliesLogRecordsOverTableRecords.handle(
            offset,
            dataStored.length - LevelDbReader.TABLE_BLOCK_TRAILER_LENGTH
        );

        parts.push(dataStored);
        offset += dataStored.length;

        const lastKey =
            entries.length === 0
                ? new Uint8Array(0)
                : LevelDbReaderAppliesLogRecordsOverTableRecords.internalKey(entries[entries.length - 1]);
        const indexStored = LevelDbReaderAppliesLogRecordsOverTableRecords.store(
            LevelDbReaderAppliesLogRecordsOverTableRecords.block([{ key: lastKey, value: dataHandle }]),
            LevelDbReader.COMPRESSION_NONE
        );
        const indexHandle = LevelDbReaderAppliesLogRecordsOverTableRecords.handle(
            offset,
            indexStored.length - LevelDbReader.TABLE_BLOCK_TRAILER_LENGTH
        );

        parts.push(indexStored);
        offset += indexStored.length;

        const metaStored = LevelDbReaderAppliesLogRecordsOverTableRecords.store(
            LevelDbReaderAppliesLogRecordsOverTableRecords.block([]),
            LevelDbReader.COMPRESSION_NONE
        );
        const metaHandle = LevelDbReaderAppliesLogRecordsOverTableRecords.handle(
            offset,
            metaStored.length - LevelDbReader.TABLE_BLOCK_TRAILER_LENGTH
        );

        parts.push(metaStored);
        parts.push(LevelDbReaderAppliesLogRecordsOverTableRecords.footer(metaHandle, indexHandle));

        return ByteUtilities.concat(parts);
    }

    private static internalKey(entry: TableEntry): Uint8Array {
        const key = LogWriter.keyBytes(entry.key);
        const suffix = new Uint8Array(LevelDbReader.INTERNAL_KEY_SUFFIX_LENGTH);
        const view = new DataView(suffix.buffer);

        view.setBigUint64(
            0,
            (BigInt(entry.sequence) << 8n) | BigInt(entry.value === undefined ? LevelDbReader.ENTRY_DELETE : LevelDbReader.ENTRY_PUT),
            true
        );

        return ByteUtilities.concat([key, suffix]);
    }

    private static block(entries: readonly { key: Uint8Array; value: Uint8Array }[]): Uint8Array {
        const parts = entries.map((entry) =>
            ByteUtilities.concat([
                LogWriter.varint(0),
                LogWriter.varint(entry.key.length),
                LogWriter.varint(entry.value.length),
                entry.key,
                entry.value,
            ])
        );
        const restarts = new Uint8Array(8);
        const view = new DataView(restarts.buffer);

        view.setUint32(0, 0, true);
        view.setUint32(4, 1, true);

        return ByteUtilities.concat([...parts, restarts]);
    }

    private static store(block: Uint8Array, compression: number): Uint8Array {
        const content = LevelDbReaderAppliesLogRecordsOverTableRecords.compress(block, compression);
        const trailer = new Uint8Array(LevelDbReader.TABLE_BLOCK_TRAILER_LENGTH);

        trailer[0] = compression;

        return ByteUtilities.concat([content, trailer]);
    }

    private static compress(block: Uint8Array, compression: number): Uint8Array {
        if (compression === LevelDbReader.COMPRESSION_ZLIB_RAW) {
            return new Uint8Array(zlib.deflateRawSync(block));
        }

        if (compression === LevelDbReader.COMPRESSION_ZLIB) {
            return new Uint8Array(zlib.deflateSync(block));
        }

        return block;
    }

    private static handle(offset: number, size: number): Uint8Array {
        return ByteUtilities.concat([LogWriter.varint(offset), LogWriter.varint(size)]);
    }

    private static footer(metaHandle: Uint8Array, indexHandle: Uint8Array): Uint8Array {
        const footer = new Uint8Array(LevelDbReader.TABLE_FOOTER_LENGTH);

        footer.set(metaHandle, 0);
        footer.set(indexHandle, metaHandle.length);
        footer.set(LevelDbReader.TABLE_SIGNATURE, LevelDbReader.TABLE_FOOTER_LENGTH - LevelDbReader.TABLE_SIGNATURE.length);

        return footer;
    }
}
