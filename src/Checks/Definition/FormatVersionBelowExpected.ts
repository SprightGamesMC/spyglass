import type { CheckContext, CheckDefinition } from "../../Types/CheckTypes.js";
import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind } from "../../Types/ModelTypes.js";
import FormatVersionBelowCheck from "../Common/FormatVersionBelowCheck.js";
import DefinitionChecks from "./DefinitionChecks.js";
import DefinitionLimits from "./DefinitionLimits.js";

export default class FormatVersionBelowExpected extends FormatVersionBelowCheck {
    readonly definition: CheckDefinition = {
        group: DefinitionChecks.GROUP,
        number: DefinitionChecks.FORMAT_VERSION_BELOW_EXPECTED,
        slug: "format-version-below-expected",
        severity: "recommendation",
        description: "format_version older than expected",
    };

    protected readonly kinds: readonly ItemKind[] = DefinitionLimits.BELOW_KINDS;

    protected override expectedVersion(context: CheckContext, item: ContentItem): GameVersion {
        return DefinitionLimits.belowExpectedVersion(item, context.loaders);
    }

    protected override comparesExactly(item: ContentItem): boolean {
        return DefinitionLimits.belowComparesExactly(item);
    }
}
