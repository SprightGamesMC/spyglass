import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class BaseGameVersionWildcard extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.BASE_GAME_VERSION_WILDCARD,
        slug: "base-game-version-wildcard",
        severity: "warning",
        description: "base_game_version is *",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== WorldLimits.PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);

            if (JsonLoader.get(manifest, "header", "base_game_version") !== WorldLimits.BASE_GAME_VERSION_WILDCARD) {
                continue;
            }

            findings.push(
                this.finding(
                    "base_game_version is " + WorldLimits.BASE_GAME_VERSION_WILDCARD + ", expected a version",
                    pack.manifestPath,
                    pack.root,
                    {
                        field: "header.base_game_version",
                    }
                )
            );
        }

        return findings;
    }
}
