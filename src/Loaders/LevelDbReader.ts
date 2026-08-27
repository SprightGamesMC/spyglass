import type { LevelDbRecords, TableBlockHandle } from "../Types/WorldTypes.js";
import zlib from "node:zlib";

export default abstract class LevelDbReader {
    static readonly LOG_RECORD_HEADER_LENGTH = 7;
    static readonly LOG_BATCH_HEADER_LENGTH = 12;
    static readonly LOG_RECORD_FULL = 1;
    static readonly LOG_RECORD_FIRST = 2;
    static readonly LOG_RECORD_LAST = 4;
    static readonly ENTRY_DELETE = 0;
    static readonly ENTRY_PUT = 1;
    static readonly TABLE_FOOTER_LENGTH = 48;
    static readonly TABLE_SIGNATURE: readonly number[] = [0x57, 0xfb, 0x80, 0x8b, 0x24, 0x75, 0x47, 0xdb];
    static readonly TABLE_BLOCK_TRAILER_LENGTH = 5;
    static readonly INTERNAL_KEY_SUFFIX_LENGTH = 8;
    static readonly COMPRESSION_NONE = 0;
    static readonly COMPRESSION_ZLIB = 2;
    static readonly COMPRESSION_ZLIB_RAW = 4;
    private static readonly LOG_BLOCK_SIZE = 32768;
    private static readonly LOG_RECORD_MIDDLE = 3;
    private static readonly LOG_RECORD_LENGTH_OFFSET = 4;
    private static readonly LOG_RECORD_LENGTH_HIGH_OFFSET = 5;
    private static readonly LOG_RECORD_TYPE_OFFSET = 6;
    private static readonly LOG_ENTRY_TYPE_LENGTH = 1;
    private static readonly DATA_START_OFFSET = 0;
    private static readonly BYTE_MASK = 0xff;
    private static readonly BYTE_SHIFT = 8;
    private static readonly UINT32_LENGTH = 4;
    private static readonly RESTART_COUNT_SIZE = 4;
    private static readonly RESTART_OFFSET_SIZE = 4;
    private static readonly VARINT_VALUE_MASK = 0x7f;
    private static readonly VARINT_CONTINUE_MASK = 0x80;
    private static readonly VARINT_SHIFT = 7;

    static readTable(bytes: Uint8Array, records: LevelDbRecords): void {
        if (bytes.length < LevelDbReader.TABLE_FOOTER_LENGTH || !LevelDbReader.hasTableSignature(bytes)) {
            throw new Error("Table file has no valid footer");
        }

        const footerOffset = bytes.length - LevelDbReader.TABLE_FOOTER_LENGTH;
        const cursor = { offset: footerOffset };

        LevelDbReader.readHandle(bytes, cursor);

        const indexHandle = LevelDbReader.readHandle(bytes, cursor);
        const indexBlock = LevelDbReader.readBlock(bytes, indexHandle);
        const handles: TableBlockHandle[] = [];

        LevelDbReader.readBlockEntries(indexBlock, (_key, value) => {
            handles.push(LevelDbReader.readHandle(value, { offset: LevelDbReader.DATA_START_OFFSET }));
        });

        for (const handle of handles) {
            const block = LevelDbReader.readBlock(bytes, handle);

            LevelDbReader.readBlockEntries(block, (internalKey, value) => {
                LevelDbReader.applyInternalKey(internalKey, value, records);
            });
        }
    }

    static readLog(bytes: Uint8Array, records: LevelDbRecords): void {
        let offset = LevelDbReader.DATA_START_OFFSET;
        let pending: Uint8Array | undefined;

        while (offset + LevelDbReader.LOG_RECORD_HEADER_LENGTH <= bytes.length) {
            const remainingInBlock = LevelDbReader.LOG_BLOCK_SIZE - (offset % LevelDbReader.LOG_BLOCK_SIZE);

            if (remainingInBlock < LevelDbReader.LOG_RECORD_HEADER_LENGTH) {
                offset += remainingInBlock;
                continue;
            }

            const length =
                bytes[offset + LevelDbReader.LOG_RECORD_LENGTH_OFFSET] |
                (bytes[offset + LevelDbReader.LOG_RECORD_LENGTH_HIGH_OFFSET] << LevelDbReader.BYTE_SHIFT);
            const type = bytes[offset + LevelDbReader.LOG_RECORD_TYPE_OFFSET];
            const start = offset + LevelDbReader.LOG_RECORD_HEADER_LENGTH;
            const end = start + length;

            if (end > bytes.length) {
                throw new Error("Log record extends past the end of the file at offset " + offset);
            }

            const fragment = bytes.subarray(start, end);

            offset = end;

            if (type === LevelDbReader.LOG_RECORD_FULL) {
                LevelDbReader.readBatch(fragment, records);
                continue;
            }

            if (type === LevelDbReader.LOG_RECORD_FIRST) {
                pending = fragment;
                continue;
            }

            if (type !== LevelDbReader.LOG_RECORD_MIDDLE && type !== LevelDbReader.LOG_RECORD_LAST) {
                continue;
            }

            if (pending === undefined) {
                throw new Error("Log continuation record without a start at offset " + offset);
            }

            pending = LevelDbReader.concat(pending, fragment);

            if (type === LevelDbReader.LOG_RECORD_LAST) {
                LevelDbReader.readBatch(pending, records);
                pending = undefined;
            }
        }
    }

    static bytesOf(key: string): Uint8Array {
        const bytes = new Uint8Array(key.length);

        for (let index = 0; index < key.length; index += 1) {
            bytes[index] = key.charCodeAt(index) & LevelDbReader.BYTE_MASK;
        }

        return bytes;
    }

    static readUint32(bytes: Uint8Array, offset: number): number {
        let value = 0;

        for (let index = 0; index < LevelDbReader.UINT32_LENGTH; index += 1) {
            value |= bytes[offset + index] << (LevelDbReader.BYTE_SHIFT * index);
        }

        return value >>> 0;
    }

    private static keyOf(bytes: Uint8Array): string {
        let key = "";

        for (const byte of bytes) {
            key += String.fromCharCode(byte);
        }

        return key;
    }

    private static readBatch(batch: Uint8Array, records: LevelDbRecords): void {
        const cursor = { offset: LevelDbReader.LOG_BATCH_HEADER_LENGTH };

        while (cursor.offset < batch.length) {
            const entryType = batch[cursor.offset];

            cursor.offset += LevelDbReader.LOG_ENTRY_TYPE_LENGTH;

            const key = LevelDbReader.readLengthPrefixed(batch, cursor);

            if (entryType === LevelDbReader.ENTRY_DELETE) {
                records.delete(LevelDbReader.keyOf(key));
                continue;
            }

            if (entryType !== LevelDbReader.ENTRY_PUT) {
                throw new Error("Unknown log entry type " + entryType);
            }

            const value = LevelDbReader.readLengthPrefixed(batch, cursor);

            records.set(LevelDbReader.keyOf(key), value);
        }
    }

    private static applyInternalKey(internalKey: Uint8Array, value: Uint8Array, records: LevelDbRecords): void {
        if (internalKey.length < LevelDbReader.INTERNAL_KEY_SUFFIX_LENGTH) {
            throw new Error("Table entry key is shorter than its sequence suffix");
        }

        const userKeyLength = internalKey.length - LevelDbReader.INTERNAL_KEY_SUFFIX_LENGTH;
        const entryType = internalKey[userKeyLength];
        const key = LevelDbReader.keyOf(internalKey.subarray(0, userKeyLength));

        if (entryType === LevelDbReader.ENTRY_DELETE) {
            records.delete(key);
            return;
        }

        records.set(key, value);
    }

    private static readBlock(bytes: Uint8Array, handle: TableBlockHandle): Uint8Array {
        const trailerOffset = handle.offset + handle.size;

        if (trailerOffset + LevelDbReader.TABLE_BLOCK_TRAILER_LENGTH > bytes.length) {
            throw new Error("Table block at offset " + handle.offset + " extends past the end of the file");
        }

        const content = bytes.subarray(handle.offset, trailerOffset);
        const compression = bytes[trailerOffset];

        if (compression === LevelDbReader.COMPRESSION_NONE) {
            return content;
        }

        if (compression === LevelDbReader.COMPRESSION_ZLIB_RAW) {
            return new Uint8Array(zlib.inflateRawSync(content));
        }

        if (compression === LevelDbReader.COMPRESSION_ZLIB) {
            return new Uint8Array(zlib.inflateSync(content));
        }

        throw new Error("Unsupported table block compression type " + compression);
    }

    private static readBlockEntries(block: Uint8Array, visit: (key: Uint8Array, value: Uint8Array) => void): void {
        if (block.length < LevelDbReader.RESTART_COUNT_SIZE) {
            throw new Error("Table block is too short to contain a restart count");
        }

        const restartCount = LevelDbReader.readUint32(block, block.length - LevelDbReader.RESTART_COUNT_SIZE);
        const entriesEnd = block.length - LevelDbReader.RESTART_COUNT_SIZE - restartCount * LevelDbReader.RESTART_OFFSET_SIZE;

        if (entriesEnd < 0) {
            throw new Error("Table block restart array is larger than the block");
        }

        const cursor = { offset: LevelDbReader.DATA_START_OFFSET };
        let previousKey = new Uint8Array(0);

        while (cursor.offset < entriesEnd) {
            const shared = LevelDbReader.readVarint(block, cursor);
            const unshared = LevelDbReader.readVarint(block, cursor);
            const valueLength = LevelDbReader.readVarint(block, cursor);

            if (shared > previousKey.length) {
                throw new Error("Table entry shares more key bytes than the previous key has");
            }

            const key = new Uint8Array(shared + unshared);

            key.set(previousKey.subarray(0, shared));
            key.set(LevelDbReader.readSlice(block, cursor, unshared), shared);

            const value = LevelDbReader.readSlice(block, cursor, valueLength);

            visit(key, value);
            previousKey = key;
        }
    }

    private static readHandle(bytes: Uint8Array, cursor: { offset: number }): TableBlockHandle {
        const offset = LevelDbReader.readVarint(bytes, cursor);
        const size = LevelDbReader.readVarint(bytes, cursor);

        return { offset, size };
    }

    private static readLengthPrefixed(bytes: Uint8Array, cursor: { offset: number }): Uint8Array {
        const length = LevelDbReader.readVarint(bytes, cursor);

        return LevelDbReader.readSlice(bytes, cursor, length);
    }

    private static readSlice(bytes: Uint8Array, cursor: { offset: number }, length: number): Uint8Array {
        if (cursor.offset + length > bytes.length) {
            throw new Error("Data ends early at offset " + cursor.offset);
        }

        const slice = bytes.slice(cursor.offset, cursor.offset + length);

        cursor.offset += length;

        return slice;
    }

    private static readVarint(bytes: Uint8Array, cursor: { offset: number }): number {
        let result = 0;
        let shift = 0;

        while (true) {
            if (cursor.offset >= bytes.length) {
                throw new Error("Varint ends early at offset " + cursor.offset);
            }

            const byte = bytes[cursor.offset];

            cursor.offset += 1;
            result += (byte & LevelDbReader.VARINT_VALUE_MASK) * 2 ** shift;

            if ((byte & LevelDbReader.VARINT_CONTINUE_MASK) === 0) {
                return result;
            }

            shift += LevelDbReader.VARINT_SHIFT;
        }
    }

    private static hasTableSignature(bytes: Uint8Array): boolean {
        const start = bytes.length - LevelDbReader.TABLE_SIGNATURE.length;

        return LevelDbReader.TABLE_SIGNATURE.every((byte, index) => bytes[start + index] === byte);
    }

    private static concat(left: Uint8Array, right: Uint8Array): Uint8Array {
        const joined = new Uint8Array(left.length + right.length);

        joined.set(left);
        joined.set(right, left.length);

        return joined;
    }
}
