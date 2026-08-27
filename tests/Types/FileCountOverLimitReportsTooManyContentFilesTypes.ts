export interface FileCountOverLimitReportsTooManyContentFilesCase {
    readonly name: string;
    readonly fileCount: number;
    readonly outsideCount?: number;
    readonly expectFinding: boolean;
}
