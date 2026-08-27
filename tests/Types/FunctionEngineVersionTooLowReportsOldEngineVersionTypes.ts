export interface FunctionEngineVersionTooLowReportsOldEngineVersionCase {
    readonly name: string;
    readonly minEngineVersion: readonly number[];
    readonly includeFunction: boolean;
    readonly expectedIds: readonly string[];
}
