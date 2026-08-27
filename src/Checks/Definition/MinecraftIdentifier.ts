import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import MinecraftIdentifierCheck from "../Common/MinecraftIdentifierCheck.js";
import DefinitionChecks from "./DefinitionChecks.js";
import DefinitionLimits from "./DefinitionLimits.js";

export default class MinecraftIdentifier extends MinecraftIdentifierCheck {
    readonly definition: CheckDefinition = {
        group: DefinitionChecks.GROUP,
        number: DefinitionChecks.MINECRAFT_IDENTIFIER,
        slug: "minecraft-identifier",
        severity: "recommendation",
        description: "Identifier starts with minecraft:",
        excludedContentTypes: ["addon"],
    };

    protected readonly kinds: readonly ItemKind[] = DefinitionLimits.IDENTIFIER_KINDS;

    protected fieldPathFor(_item: unknown, value: JsonValue | undefined): readonly string[] | undefined {
        if (!JsonLoader.isObject(value)) {
            return undefined;
        }

        for (const rootKey of Object.keys(value)) {
            if (typeof JsonLoader.get(value, ...DefinitionLimits.identifierPath(rootKey)) === "string") {
                return DefinitionLimits.identifierPath(rootKey);
            }
        }

        return undefined;
    }
}
