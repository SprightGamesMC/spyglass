import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import FormatVersionReader from "../../Loaders/FormatVersionReader.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";
import ParticleChecks from "./ParticleChecks.js";
import ParticleLimits from "./ParticleLimits.js";

export default class IdentifierNotNamespaced extends Check {
    readonly definition: CheckDefinition = {
        group: ParticleChecks.GROUP,
        number: ParticleChecks.IDENTIFIER_NOT_NAMESPACED,
        slug: "identifier-not-namespaced",
        severity: "error",
        description: "Identifier is not namespace:name",
    };

    private static async inspect(context: CheckContext, path: string): Promise<string | undefined> {
        const result = await FormatVersionReader.read(context, path);

        if (result.status !== "ok" || result.version === undefined) {
            return undefined;
        }

        if (VersionUtilities.compare(result.version, ParticleLimits.NAMESPACE_CHECK_MINIMUM_VERSION) < 0) {
            return undefined;
        }

        const root = await context.loaders.json.readObject(path);
        const identifier = JsonLoader.get(root, ...ParticleLimits.IDENTIFIER_PATH);

        if (typeof identifier !== "string") {
            return "Particle has no identifier, expected namespace:name";
        }

        if (ParticleLimits.NAMESPACED_IDENTIFIER.test(identifier)) {
            return undefined;
        }

        return "Particle identifier " + identifier + " is not namespace:name";
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, ParticleLimits.KINDS)) {
            const message = await IdentifierNotNamespaced.inspect(context, item.path);

            if (message === undefined) {
                continue;
            }

            findings.push(this.finding(message, item.path, pack.root, { field: ParticleLimits.IDENTIFIER_FIELD }));
        }

        return findings;
    }
}
