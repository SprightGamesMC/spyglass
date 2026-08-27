export interface ExitCodeCase {
    readonly name: string;
    readonly arguments: readonly string[];
    readonly exitCode: number;
    readonly stdoutIncludes?: string;
    readonly stderrIncludes?: string;
}
