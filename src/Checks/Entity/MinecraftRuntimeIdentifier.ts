import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import MinecraftIdentifierCheck from "../Common/MinecraftIdentifierCheck.js";
import EntityChecks from "./EntityChecks.js";
import EntityLimits from "./EntityLimits.js";

export default class MinecraftRuntimeIdentifier extends MinecraftIdentifierCheck {
    readonly definition: CheckDefinition = {
        group: EntityChecks.GROUP,
        number: EntityChecks.MINECRAFT_RUNTIME_IDENTIFIER,
        slug: "minecraft-runtime-identifier",
        severity: "recommendation",
        description: "runtime_identifier starts with minecraft:",
        excludedContentTypes: ["addon"],
    };

    protected readonly kinds: readonly ItemKind[] = EntityLimits.KINDS;
    protected override readonly packType: PackType = EntityLimits.PACK_TYPE;

    protected fieldPathFor(): readonly string[] | undefined {
        return EntityLimits.RUNTIME_IDENTIFIER_PATH;
    }
}
