import type { CheckContext, CheckDefinition } from "../../Types/CheckTypes.js";
import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind } from "../../Types/ModelTypes.js";
import FormatVersionAboveCheck from "../Common/FormatVersionAboveCheck.js";
import DefinitionChecks from "./DefinitionChecks.js";
import DefinitionLimits from "./DefinitionLimits.js";

export default class FormatVersionAboveExpected extends FormatVersionAboveCheck {
    readonly definition: CheckDefinition = {
        group: DefinitionChecks.GROUP,
        number: DefinitionChecks.FORMAT_VERSION_ABOVE_EXPECTED,
        slug: "format-version-above-expected",
        severity: "error",
        description: "format_version newer than expected",
    };

    protected readonly kinds: readonly ItemKind[] = DefinitionLimits.ABOVE_KINDS;

    protected override expectedVersion(context: CheckContext, item: ContentItem): GameVersion {
        return DefinitionLimits.aboveExpectedVersion(item, context.loaders);
    }

    protected override comparesExactly(item: ContentItem): boolean {
        return DefinitionLimits.aboveComparesExactly(item);
    }
}
