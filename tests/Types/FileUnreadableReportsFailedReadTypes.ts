export interface FileUnreadableReportsFailedReadCase {
    readonly name: string;
    readonly unreadable: readonly string[];
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}
