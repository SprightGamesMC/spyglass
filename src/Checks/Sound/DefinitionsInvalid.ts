import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind } from "../../Types/ModelTypes.js";
import type { Schema } from "../../Types/SchemaTypes.js";
import SoundDefinitionsSchema from "../../Data/Schemas/SoundDefinitionsSchema.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import SchemaInvalidCheck from "../Common/SchemaInvalidCheck.js";
import SoundChecks from "./SoundChecks.js";
import SoundLimits from "./SoundLimits.js";

export default class DefinitionsInvalid extends SchemaInvalidCheck {
    readonly definition: CheckDefinition = {
        group: SoundChecks.GROUP,
        number: SoundChecks.DEFINITIONS_INVALID,
        slug: "definitions-invalid",
        severity: "error",
        description: "sound_definitions.json does not match schema",
    };

    protected readonly kinds: readonly ItemKind[] = SoundLimits.KINDS;

    protected schemaFor(_item: ContentItem, value: JsonValue | undefined): Schema {
        if (!JsonLoader.isObject(value)) {
            return SoundDefinitionsSchema.WITH_FORMAT_VERSION;
        }

        const hasModernKeys =
            value[SoundDefinitionsSchema.FORMAT_VERSION_KEY] !== undefined || value[SoundDefinitionsSchema.DEFINITIONS_KEY] !== undefined;

        return hasModernKeys ? SoundDefinitionsSchema.WITH_FORMAT_VERSION : SoundDefinitionsSchema.LEGACY;
    }
}
