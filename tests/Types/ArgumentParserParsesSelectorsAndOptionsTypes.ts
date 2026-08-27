import type { SkipSelector } from "../../src/Types/CliTypes.js";

export interface SkipCase {
    readonly text: string;
    readonly expected?: SkipSelector;
}
