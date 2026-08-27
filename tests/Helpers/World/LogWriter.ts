import type { LogEntry } from "../../Types/World/WorldFixtureTypes.js";
import LevelDbReader from "../../../src/Loaders/LevelDbReader.js";
import ByteUtilities from "../Core/ByteUtilities.js";

export default abstract class LogWriter {
    static write(batches: readonly (readonly LogEntry[])[]): Uint8Array {
        return ByteUtilities.concat(batches.map((batch, index) => LogWriter.record(LogWriter.batch(batch, index + 1))));
    }

    static writeSplit(entries: readonly LogEntry[]): Uint8Array {
        const batch = LogWriter.batch(entries, 1);
        const middle = Math.floor(batch.length / 2);

        return ByteUtilities.concat([
            LogWriter.record(batch.subarray(0, middle), LevelDbReader.LOG_RECORD_FIRST),
            LogWriter.record(batch.subarray(middle), LevelDbReader.LOG_RECORD_LAST),
        ]);
    }

    static varint(value: number): Uint8Array {
        const bytes: number[] = [];
        let remaining = value;

        while (remaining >= 0x80) {
            bytes.push((remaining & 0x7f) | 0x80);
            remaining = Math.floor(remaining / 128);
        }

        bytes.push(remaining);

        return new Uint8Array(bytes);
    }

    static keyBytes(key: string | Uint8Array): Uint8Array {
        return typeof key === "string" ? LevelDbReader.bytesOf(key) : key;
    }

    private static record(payload: Uint8Array, type = LevelDbReader.LOG_RECORD_FULL): Uint8Array {
        const header = new Uint8Array(LevelDbReader.LOG_RECORD_HEADER_LENGTH);

        header[4] = payload.length & 0xff;
        header[5] = (payload.length >> 8) & 0xff;
        header[6] = type;

        return ByteUtilities.concat([header, payload]);
    }

    private static batch(entries: readonly LogEntry[], sequence: number): Uint8Array {
        const header = new Uint8Array(LevelDbReader.LOG_BATCH_HEADER_LENGTH);
        const view = new DataView(header.buffer);

        view.setUint32(0, sequence, true);
        view.setUint32(8, entries.length, true);

        return ByteUtilities.concat([header, ...entries.map((entry) => LogWriter.entry(entry))]);
    }

    private static entry(entry: LogEntry): Uint8Array {
        const key = LogWriter.keyBytes(entry.key);

        if (entry.value === undefined) {
            return ByteUtilities.concat([new Uint8Array([LevelDbReader.ENTRY_DELETE]), LogWriter.varint(key.length), key]);
        }

        return ByteUtilities.concat([
            new Uint8Array([LevelDbReader.ENTRY_PUT]),
            LogWriter.varint(key.length),
            key,
            LogWriter.varint(entry.value.length),
            entry.value,
        ]);
    }
}
