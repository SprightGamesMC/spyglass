import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class BaseGameVersionMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.BASE_GAME_VERSION_MISSING,
        slug: "base-game-version-missing",
        severity: "error",
        description: "World template header has no base_game_version",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== WorldLimits.PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);

            if (manifest === undefined || JsonLoader.get(manifest, "header", "base_game_version") !== undefined) {
                continue;
            }

            findings.push(
                this.finding("World template header has no base_game_version", pack.manifestPath, pack.root, {
                    field: "header.base_game_version",
                })
            );
        }

        return findings;
    }
}
