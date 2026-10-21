export interface SettingsRun {
    readonly exitCode: number;
    readonly stderr: string;
    readonly contentType?: string;
    readonly layout?: string;
    readonly inputFolderName?: string;
}
