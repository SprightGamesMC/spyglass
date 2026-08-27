export interface NbtEntry {
    readonly name: string;
    readonly type: number;
    readonly value: NbtEntryValue;
}

export type NbtEntryValue = number | bigint | string | readonly NbtEntry[] | NbtListValue;

export interface NbtListValue {
    readonly childType: number;
    readonly items: readonly NbtEntryValue[];
}

export interface LogEntry {
    readonly key: string | Uint8Array;
    readonly value?: Uint8Array;
}

export interface TableEntry {
    readonly key: string | Uint8Array;
    readonly value?: Uint8Array;
    readonly sequence: number;
}

export interface TableOptions {
    readonly compression: number;
}

export interface ChunkKeyOptions {
    readonly x: number;
    readonly z: number;
    readonly dimension?: number;
    readonly tag: number;
    readonly subChunk?: number;
}
