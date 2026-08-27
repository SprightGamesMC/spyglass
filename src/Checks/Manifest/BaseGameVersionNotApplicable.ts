import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class BaseGameVersionNotApplicable extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.BASE_GAME_VERSION_NOT_APPLICABLE,
        slug: "base-game-version-not-applicable",
        severity: "error",
        description: "base_game_version on a pack that is not a world template",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (
            pack.type === PackItemLoader.WORLD_TEMPLATE_PACK_TYPE ||
            JsonLoader.get(manifest, "header", "base_game_version") === undefined
        ) {
            return [];
        }

        const message = "header.base_game_version is only for world templates, this pack is a " + pack.type + " pack";

        return [this.manifestFinding(pack, message, "header.base_game_version")];
    }
}
