export interface EmoteLayoutsRejectTheOtherInputCase {
    readonly name: string;
    readonly scenario: string;
    readonly projectFile?: string;
    readonly arguments: readonly string[];
    readonly expectedExitCode: number;
    readonly expectedError?: string;
}

export interface EmoteLayoutsRejectTheOtherInputResult {
    readonly exitCode: number;
    readonly stderr: string;
}
