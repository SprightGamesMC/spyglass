export interface WorldTemplateCase {
    readonly name: string;
    readonly header: Record<string, unknown>;
    readonly formatVersion?: number;
    readonly expectFinding: boolean;
}
