import type { NbtEntry, NbtEntryValue, NbtListValue } from "../../Types/World/WorldFixtureTypes.js";
import NbtReader from "../../../src/Loaders/NbtReader.js";
import ByteUtilities from "../Core/ByteUtilities.js";

export default abstract class NbtWriter {
    static readonly LEVEL_DAT_VERSION = 10;

    static byte(name: string, value: number): NbtEntry {
        return { name, type: NbtReader.TAG_BYTE, value };
    }

    static int(name: string, value: number): NbtEntry {
        return { name, type: NbtReader.TAG_INT, value };
    }

    static string(name: string, value: string): NbtEntry {
        return { name, type: NbtReader.TAG_STRING, value };
    }

    static compound(name: string, entries: readonly NbtEntry[]): NbtEntry {
        return { name, type: NbtReader.TAG_COMPOUND, value: entries };
    }

    static list(name: string, childType: number, items: readonly NbtEntryValue[]): NbtEntry {
        return { name, type: NbtReader.TAG_LIST, value: { childType, items } };
    }

    static root(entries: readonly NbtEntry[], name = ""): Uint8Array {
        return ByteUtilities.concat([
            NbtWriter.uint8(NbtReader.TAG_COMPOUND),
            NbtWriter.text(name),
            NbtWriter.payload(NbtReader.TAG_COMPOUND, entries),
        ]);
    }

    static roots(rootEntries: readonly (readonly NbtEntry[])[]): Uint8Array {
        return ByteUtilities.concat(rootEntries.map((entries) => NbtWriter.root(entries)));
    }

    static levelDat(entries: readonly NbtEntry[]): Uint8Array {
        const body = NbtWriter.root(entries);
        const header = new Uint8Array(8);
        const view = new DataView(header.buffer);

        view.setInt32(0, NbtWriter.LEVEL_DAT_VERSION, true);
        view.setInt32(4, body.length, true);

        return ByteUtilities.concat([header, body]);
    }

    private static payload(type: number, value: NbtEntryValue): Uint8Array {
        switch (type) {
            case NbtReader.TAG_BYTE:
                return NbtWriter.uint8(Number(value));
            case NbtReader.TAG_SHORT:
                return NbtWriter.numeric(2, (view) => view.setInt16(0, Number(value), true));
            case NbtReader.TAG_INT:
                return NbtWriter.numeric(4, (view) => view.setInt32(0, Number(value), true));
            case NbtReader.TAG_LONG:
                return NbtWriter.numeric(8, (view) => view.setBigInt64(0, BigInt(value as number | bigint), true));
            case NbtReader.TAG_FLOAT:
                return NbtWriter.numeric(4, (view) => view.setFloat32(0, Number(value), true));
            case NbtReader.TAG_DOUBLE:
                return NbtWriter.numeric(8, (view) => view.setFloat64(0, Number(value), true));
            case NbtReader.TAG_STRING:
                return NbtWriter.text(String(value));
            case NbtReader.TAG_COMPOUND:
                return NbtWriter.compoundPayload(value as readonly NbtEntry[]);
            case NbtReader.TAG_LIST:
                return NbtWriter.listPayload(value as NbtListValue);
            default:
                throw new Error("Unsupported tag type " + type);
        }
    }

    private static compoundPayload(entries: readonly NbtEntry[]): Uint8Array {
        const parts = entries.map((entry) =>
            ByteUtilities.concat([NbtWriter.uint8(entry.type), NbtWriter.text(entry.name), NbtWriter.payload(entry.type, entry.value)])
        );

        return ByteUtilities.concat([...parts, NbtWriter.uint8(NbtReader.TAG_END)]);
    }

    private static listPayload(list: NbtListValue): Uint8Array {
        const header = ByteUtilities.concat([
            NbtWriter.uint8(list.childType),
            NbtWriter.numeric(4, (view) => view.setInt32(0, list.items.length, true)),
        ]);

        return ByteUtilities.concat([header, ...list.items.map((item) => NbtWriter.payload(list.childType, item))]);
    }

    private static text(value: string): Uint8Array {
        const encoded = new TextEncoder().encode(value);

        return ByteUtilities.concat([NbtWriter.numeric(2, (view) => view.setUint16(0, encoded.length, true)), encoded]);
    }

    private static uint8(value: number): Uint8Array {
        return new Uint8Array([value & 0xff]);
    }

    private static numeric(length: number, write: (view: DataView) => void): Uint8Array {
        const bytes = new Uint8Array(length);

        write(new DataView(bytes.buffer));

        return bytes;
    }
}
