import type { NbtCompound, NbtReadState, NbtValue } from "../Types/WorldTypes.js";

export default abstract class NbtReader {
    static readonly TAG_END = 0;
    static readonly TAG_BYTE = 1;
    static readonly TAG_SHORT = 2;
    static readonly TAG_INT = 3;
    static readonly TAG_LONG = 4;
    static readonly TAG_FLOAT = 5;
    static readonly TAG_DOUBLE = 6;
    static readonly TAG_STRING = 8;
    static readonly TAG_LIST = 9;
    static readonly TAG_COMPOUND = 10;
    private static readonly TAG_BYTE_ARRAY = 7;
    private static readonly TAG_INT_ARRAY = 11;
    private static readonly TAG_LONG_ARRAY = 12;
    private static readonly LEVEL_DAT_HEADER_LENGTH = 8;
    private static readonly FILE_START_OFFSET = 0;
    private static readonly BYTE_LENGTH = 1;
    private static readonly SHORT_LENGTH = 2;
    private static readonly INT_LENGTH = 4;
    private static readonly LONG_LENGTH = 8;
    private static readonly FLOAT_LENGTH = 4;
    private static readonly DOUBLE_LENGTH = 8;

    static readLevelDat(bytes: Uint8Array): NbtCompound {
        if (bytes.length < NbtReader.LEVEL_DAT_HEADER_LENGTH) {
            throw new Error("level.dat is shorter than its header");
        }

        const state = NbtReader.createState(bytes, NbtReader.LEVEL_DAT_HEADER_LENGTH);

        return NbtReader.readRoot(state);
    }

    static readRoots(bytes: Uint8Array): NbtCompound[] {
        const state = NbtReader.createState(bytes, NbtReader.FILE_START_OFFSET);
        const roots: NbtCompound[] = [];

        while (state.offset < bytes.length) {
            roots.push(NbtReader.readRoot(state));
        }

        return roots;
    }

    static readFirstRoot(bytes: Uint8Array): NbtCompound {
        return NbtReader.readRoot(NbtReader.createState(bytes, NbtReader.FILE_START_OFFSET));
    }

    static isCompound(value: NbtValue | undefined): value is NbtCompound {
        return typeof value === "object" && value !== null && !Array.isArray(value) && !ArrayBuffer.isView(value);
    }

    static isTrue(value: NbtValue | undefined): boolean {
        return value === 1 || value === 1n;
    }

    static asNumber(value: NbtValue | undefined): number | undefined {
        if (typeof value === "number") {
            return value;
        }

        return typeof value === "bigint" ? Number(value) : undefined;
    }

    static asString(value: NbtValue | undefined): string | undefined {
        return typeof value === "string" ? value : undefined;
    }

    private static createState(bytes: Uint8Array, offset: number): NbtReadState {
        return { bytes, view: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), offset };
    }

    private static readRoot(state: NbtReadState): NbtCompound {
        const type = NbtReader.readByte(state);

        if (type !== NbtReader.TAG_COMPOUND) {
            throw new Error("NBT root is not a compound, tag type " + type);
        }

        NbtReader.readString(state);

        return NbtReader.readCompound(state);
    }

    private static readCompound(state: NbtReadState): NbtCompound {
        const compound: NbtCompound = {};

        while (true) {
            const type = NbtReader.readByte(state);

            if (type === NbtReader.TAG_END) {
                return compound;
            }

            const name = NbtReader.readString(state);

            compound[name] = NbtReader.readPayload(state, type);
        }
    }

    private static readPayload(state: NbtReadState, type: number): NbtValue {
        switch (type) {
            case NbtReader.TAG_BYTE:
                return NbtReader.readSignedByte(state);
            case NbtReader.TAG_SHORT:
                return NbtReader.readInt16(state);
            case NbtReader.TAG_INT:
                return NbtReader.readInt32(state);
            case NbtReader.TAG_LONG:
                return NbtReader.readInt64(state);
            case NbtReader.TAG_FLOAT:
                return NbtReader.readFloat32(state);
            case NbtReader.TAG_DOUBLE:
                return NbtReader.readFloat64(state);
            case NbtReader.TAG_BYTE_ARRAY:
                return NbtReader.readByteArray(state);
            case NbtReader.TAG_STRING:
                return NbtReader.readString(state);
            case NbtReader.TAG_LIST:
                return NbtReader.readList(state);
            case NbtReader.TAG_COMPOUND:
                return NbtReader.readCompound(state);
            case NbtReader.TAG_INT_ARRAY:
                return NbtReader.readIntArray(state);
            case NbtReader.TAG_LONG_ARRAY:
                return NbtReader.readLongArray(state);
            default:
                throw new Error("Unknown NBT tag type " + type + " at offset " + state.offset);
        }
    }

    private static readList(state: NbtReadState): NbtValue[] {
        const childType = NbtReader.readByte(state);
        const count = NbtReader.readInt32(state);
        const values: NbtValue[] = [];

        if (count < 0) {
            throw new Error("Negative NBT list length at offset " + state.offset);
        }

        for (let index = 0; index < count; index += 1) {
            values.push(NbtReader.readPayload(state, childType));
        }

        return values;
    }

    private static readByteArray(state: NbtReadState): Uint8Array {
        const length = NbtReader.readInt32(state);

        NbtReader.ensureAvailable(state, length);

        const bytes = state.bytes.slice(state.offset, state.offset + length);

        state.offset += length;

        return bytes;
    }

    private static readIntArray(state: NbtReadState): Int32Array {
        const length = NbtReader.readInt32(state);
        const values = new Int32Array(length);

        for (let index = 0; index < length; index += 1) {
            values[index] = NbtReader.readInt32(state);
        }

        return values;
    }

    private static readLongArray(state: NbtReadState): BigInt64Array {
        const length = NbtReader.readInt32(state);
        const values = new BigInt64Array(length);

        for (let index = 0; index < length; index += 1) {
            values[index] = NbtReader.readInt64(state);
        }

        return values;
    }

    private static readString(state: NbtReadState): string {
        const length = NbtReader.readUint16(state);

        NbtReader.ensureAvailable(state, length);

        const text = new TextDecoder().decode(state.bytes.subarray(state.offset, state.offset + length));

        state.offset += length;

        return text;
    }

    private static readByte(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.BYTE_LENGTH);

        const value = state.bytes[state.offset];

        state.offset += NbtReader.BYTE_LENGTH;

        return value;
    }

    private static readSignedByte(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.BYTE_LENGTH);

        const value = state.view.getInt8(state.offset);

        state.offset += NbtReader.BYTE_LENGTH;

        return value;
    }

    private static readUint16(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.SHORT_LENGTH);

        const value = state.view.getUint16(state.offset, true);

        state.offset += NbtReader.SHORT_LENGTH;

        return value;
    }

    private static readInt16(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.SHORT_LENGTH);

        const value = state.view.getInt16(state.offset, true);

        state.offset += NbtReader.SHORT_LENGTH;

        return value;
    }

    private static readInt32(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.INT_LENGTH);

        const value = state.view.getInt32(state.offset, true);

        state.offset += NbtReader.INT_LENGTH;

        return value;
    }

    private static readInt64(state: NbtReadState): bigint {
        NbtReader.ensureAvailable(state, NbtReader.LONG_LENGTH);

        const value = state.view.getBigInt64(state.offset, true);

        state.offset += NbtReader.LONG_LENGTH;

        return value;
    }

    private static readFloat32(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.FLOAT_LENGTH);

        const value = state.view.getFloat32(state.offset, true);

        state.offset += NbtReader.FLOAT_LENGTH;

        return value;
    }

    private static readFloat64(state: NbtReadState): number {
        NbtReader.ensureAvailable(state, NbtReader.DOUBLE_LENGTH);

        const value = state.view.getFloat64(state.offset, true);

        state.offset += NbtReader.DOUBLE_LENGTH;

        return value;
    }

    private static ensureAvailable(state: NbtReadState, length: number): void {
        if (state.offset + length > state.bytes.length) {
            throw new Error("NBT data ends early at offset " + state.offset);
        }
    }
}
