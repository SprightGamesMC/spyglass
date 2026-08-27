export interface MashupCoverageCase {
    readonly name: string;
    readonly overriddenCount: number;
    readonly nested: boolean;
    readonly hasWorld: boolean;
    readonly expectFinding: boolean;
}
