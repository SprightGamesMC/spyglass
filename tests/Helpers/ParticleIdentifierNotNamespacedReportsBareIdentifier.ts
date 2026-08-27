import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ParticleIdentifierCase } from "../Types/ParticleIdentifierNotNamespacedReportsBareIdentifierTypes.js";
import IdentifierNotNamespaced from "../../src/Checks/Particle/IdentifierNotNamespaced.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ParticleIdentifierNotNamespacedReportsBareIdentifier {
    static readonly ID = "PARTICLE/201";
    static readonly PATH = "RP/particles/smoke.json";
    static readonly CASES: readonly ParticleIdentifierCase[] = [
        {
            name: "identifier demo:smoke is in namespace:name form",
            content: ParticleIdentifierNotNamespacedReportsBareIdentifier.particle("1.20.60", "demo:smoke"),
            expectFinding: false,
        },
        {
            name: "identifier smoke on format 1.21.0 has no namespace",
            content: ParticleIdentifierNotNamespacedReportsBareIdentifier.particle("1.21.0", "smoke"),
            expectFinding: true,
        },
        {
            name: "identifier a:smoke has a one character namespace that is too short",
            content: ParticleIdentifierNotNamespacedReportsBareIdentifier.particle("1.20.60", "a:smoke"),
            expectFinding: true,
        },
        {
            name: "particle without an identifier on format 1.20.60 has no namespaced name",
            content: { format_version: "1.20.60", particle_effect: {} },
            expectFinding: true,
        },
        {
            name: "identifier smoke on format 1.20.50 predates the namespace requirement",
            content: ParticleIdentifierNotNamespacedReportsBareIdentifier.particle("1.20.50", "smoke"),
            expectFinding: false,
        },
        {
            name: "identifier smoke without format_version has no version so it is not checked",
            content: { particle_effect: { description: { identifier: "smoke" } } },
            expectFinding: false,
        },
        { name: "particle file that does not parse is skipped", content: "{", expectFinding: false },
    ];

    static particle(formatVersion: string, identifier: string): object {
        return { format_version: formatVersion, particle_effect: { description: { identifier } } };
    }

    static run(content: object | string): Promise<Finding[]> {
        const files = {
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [ParticleIdentifierNotNamespacedReportsBareIdentifier.PATH]: content,
        };

        return ModelFixture.findings(new IdentifierNotNamespaced(), files);
    }
}
