export interface JsonNotUtf8ReportsUndecodableBytesCase {
    readonly name: string;
    readonly content: Uint8Array;
    readonly expectFinding: boolean;
}
