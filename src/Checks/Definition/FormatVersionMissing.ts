import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";
import FormatVersionMissingCheck from "../Common/FormatVersionMissingCheck.js";
import DefinitionChecks from "./DefinitionChecks.js";
import DefinitionLimits from "./DefinitionLimits.js";

export default class FormatVersionMissing extends FormatVersionMissingCheck {
    readonly definition: CheckDefinition = {
        group: DefinitionChecks.GROUP,
        number: DefinitionChecks.FORMAT_VERSION_MISSING,
        slug: "format-version-missing",
        severity: "error",
        description: "Definition has no parseable format_version",
    };

    protected readonly kinds: readonly ItemKind[] = DefinitionLimits.MISSING_KINDS;
}
