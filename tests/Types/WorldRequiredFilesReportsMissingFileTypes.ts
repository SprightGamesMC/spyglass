export interface WorldRequiredFilesReportsMissingFileCase {
    readonly name: string;
    readonly includeLevelname: boolean;
    readonly includeDatabase: boolean;
    readonly expectedIds: readonly string[];
}
