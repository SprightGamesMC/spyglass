export interface MeshCase {
    readonly name: string;
    readonly content: object | string;
    readonly expectedFields: readonly string[];
}
