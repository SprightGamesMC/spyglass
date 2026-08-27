export interface ScenarioDefinition {
    readonly name: string;
    readonly arguments: readonly string[];
}

export interface ScenarioReport {
    readonly content_type: string;
    readonly layout: string;
    readonly passed: boolean;
    readonly counts: Record<string, number>;
    readonly findings: readonly Record<string, unknown>[];
}

export interface ScenarioComparison {
    readonly name: string;
    readonly exitCode: number;
    readonly actual: ScenarioReport;
    readonly expected: ScenarioReport | undefined;
    readonly updated: boolean;
}
