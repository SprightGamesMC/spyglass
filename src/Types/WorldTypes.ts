import type { JsonObject } from "./LoaderTypes.js";

export type NbtValue = number | bigint | string | Uint8Array | Int32Array | BigInt64Array | NbtValue[] | NbtCompound;

export type NbtCompound = { [name: string]: NbtValue };

export interface NbtReadState {
    readonly bytes: Uint8Array;
    readonly view: DataView;
    offset: number;
}

export interface TableBlockHandle {
    readonly offset: number;
    readonly size: number;
}

export type LevelDbRecords = Map<string, Uint8Array>;

export interface CommandBlockRecord {
    readonly command: string;
    readonly version?: number;
    readonly location: string;
}

export interface LevelDatReadResult {
    readonly value?: NbtCompound;
    readonly unparseable: boolean;
}

export interface WorldData {
    readonly levelDatPath?: string;
    readonly levelDat?: NbtCompound;
    readonly levelDatUnparseable: boolean;
    readonly hasDimensionTable: boolean;
    readonly dimensionTable: ReadonlyMap<string, number>;
    readonly chunkDimensionIds: ReadonlySet<number>;
    readonly commandBlocks: readonly CommandBlockRecord[];
}

export interface PackReferenceEntry {
    readonly index: number;
    readonly entry: JsonObject;
}
