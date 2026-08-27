import type { PackPathCase } from "./Core/AddonFixtureTypes.js";

export interface UiNotAllowedReportsUiFolderCase extends PackPathCase {
    readonly expectedIds: readonly string[];
}
