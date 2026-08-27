import type { NbtEntry } from "./World/WorldFixtureTypes.js";

export interface ExperimentCase {
    readonly name: string;
    readonly entries: readonly NbtEntry[];
    readonly expectFinding: boolean;
    readonly expectedText?: string;
}
