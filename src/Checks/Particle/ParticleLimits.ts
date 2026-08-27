import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";

export default abstract class ParticleLimits {
    static readonly NAMESPACE_CHECK_MINIMUM_VERSION: GameVersion = { major: 1, minor: 20, patch: 60 };
    static readonly NAMESPACED_IDENTIFIER = /^\w{2,}:\w+/;
    static readonly IDENTIFIER_PATH: readonly string[] = ["particle_effect", "description", "identifier"];
    static readonly IDENTIFIER_FIELD = ParticleLimits.IDENTIFIER_PATH.join(".");
    static readonly KINDS: readonly ItemKind[] = ["particle"];
}
