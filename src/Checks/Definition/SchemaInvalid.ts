import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ContentItem, ItemKind } from "../../Types/ModelTypes.js";
import type { Schema } from "../../Types/SchemaTypes.js";
import SchemaInvalidCheck from "../Common/SchemaInvalidCheck.js";
import DefinitionChecks from "./DefinitionChecks.js";
import DefinitionLimits from "./DefinitionLimits.js";

export default class SchemaInvalid extends SchemaInvalidCheck {
    readonly definition: CheckDefinition = {
        group: DefinitionChecks.GROUP,
        number: DefinitionChecks.SCHEMA_INVALID,
        slug: "schema-invalid",
        severity: "warning",
        description: "Definition does not match schema",
    };

    protected readonly kinds: readonly ItemKind[] = DefinitionLimits.SCHEMA_KINDS;

    protected schemaFor(item: ContentItem): Schema {
        const schema = DefinitionLimits.SCHEMAS.get(item.kind);

        if (schema === undefined) {
            throw new Error("No schema for definition kind " + item.kind);
        }

        return schema;
    }

    protected override requiresCurrentFormatVersion(item: ContentItem): boolean {
        return DefinitionLimits.CURRENT_RELEASE_SCHEMA_KINDS.includes(item.kind);
    }
}
