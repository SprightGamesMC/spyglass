export interface ConfigCase {
    readonly name: string;
    readonly value: unknown;
    readonly valid: boolean;
}

export interface ResolvedConfigPaths {
    readonly input?: string;
    readonly output?: string;
    readonly expectedInput: string;
    readonly expectedOutput: string;
}
