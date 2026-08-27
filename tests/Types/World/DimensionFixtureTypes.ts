export interface DimensionCase {
    readonly name: string;
    readonly chunkDimensions: readonly (number | undefined)[];
    readonly table?: Readonly<Record<string, number>>;
    readonly expectedIds: readonly string[];
}
