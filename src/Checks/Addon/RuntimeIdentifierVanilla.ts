import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import MinecraftIdentifierCheck from "../Common/MinecraftIdentifierCheck.js";
import EntityLimits from "../Entity/EntityLimits.js";
import AddonChecks from "./AddonChecks.js";

export default class RuntimeIdentifierVanilla extends MinecraftIdentifierCheck {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.RUNTIME_IDENTIFIER_VANILLA,
        slug: "runtime-identifier-vanilla",
        severity: "error",
        description: "Entity runtime_identifier starts with minecraft:",
    };

    protected readonly kinds: readonly ItemKind[] = EntityLimits.KINDS;
    protected override readonly packType: PackType = EntityLimits.PACK_TYPE;

    protected fieldPathFor(): readonly string[] | undefined {
        return EntityLimits.RUNTIME_IDENTIFIER_PATH;
    }
}
