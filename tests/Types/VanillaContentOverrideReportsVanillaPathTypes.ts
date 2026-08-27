import type { PackPathCase } from "./Core/AddonFixtureTypes.js";

export interface VanillaContentOverrideReportsVanillaPathCase extends PackPathCase {
    readonly expectedIds: readonly string[];
}
