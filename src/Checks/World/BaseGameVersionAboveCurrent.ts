import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class BaseGameVersionAboveCurrent extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.BASE_GAME_VERSION_ABOVE_CURRENT,
        slug: "base-game-version-above-current",
        severity: "error",
        description: "base_game_version newer than current release",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const current = context.loaders.currentGameVersion;

        for (const pack of context.model.packs) {
            if (pack.type !== WorldLimits.PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);
            const version = VersionUtilities.parse(JsonLoader.get(manifest, "header", "base_game_version"));

            if (version === undefined || !VersionUtilities.isAboveCurrent(version, current)) {
                continue;
            }

            findings.push(
                this.finding(
                    "base_game_version " +
                        VersionUtilities.format(version) +
                        " is above the current release " +
                        VersionUtilities.format(current),
                    pack.manifestPath,
                    pack.root,
                    { field: "header.base_game_version" }
                )
            );
        }

        return findings;
    }
}
