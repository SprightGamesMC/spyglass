import type { Finding } from "../../src/Types/CheckTypes.js";
import type { VanillaData } from "../../src/Types/LoaderTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { MashupCoverageCase } from "../Types/MashupCoverageLowReportsGlobalResourcePackUnderThresholdTypes.js";
import MashupCoverageLow from "../../src/Checks/World/MashupCoverageLow.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MashupCoverageLowReportsGlobalResourcePackUnderThreshold {
    static readonly ID = "WORLD/702";
    static readonly VANILLA_TEXTURES: readonly string[] = [
        "textures/blocks/stone.png",
        "textures/blocks/dirt.png",
        "textures/items/apple.png",
        "textures/entity/cow.png",
        "textures/entity/pig.png",
    ];
    static readonly CASES: readonly MashupCoverageCase[] = [
        {
            name: "global resource pack overriding 5 of 5 vanilla textures is above the 60 percent coverage minimum",
            overriddenCount: 5,
            nested: false,
            hasWorld: true,
            expectFinding: false,
        },
        {
            name: "global resource pack overriding 3 of 5 vanilla textures is at the 60 percent coverage minimum",
            overriddenCount: 3,
            nested: false,
            hasWorld: true,
            expectFinding: false,
        },
        {
            name: "global resource pack overriding 2 of 5 vanilla textures is below the 60 percent coverage minimum",
            overriddenCount: 2,
            nested: false,
            hasWorld: true,
            expectFinding: true,
        },
        {
            name: "resource pack nested inside the world template is not a global pack so coverage is not measured",
            overriddenCount: 2,
            nested: true,
            hasWorld: true,
            expectFinding: false,
        },
        {
            name: "resource pack without a world template is not a mashup so coverage is not measured",
            overriddenCount: 2,
            nested: false,
            hasWorld: false,
            expectFinding: false,
        },
    ];

    static async run(entry: MashupCoverageCase): Promise<Finding[]> {
        const packRoot = entry.nested ? "World/resource_packs/RP" : "RP";
        const files: Record<string, FixtureFiles[string]> = { [packRoot + "/manifest.json"]: ModelFixture.resourceManifest() };

        if (entry.hasWorld) {
            files["World/manifest.json"] = ModelFixture.worldTemplateManifest();
        }

        for (const path of MashupCoverageLowReportsGlobalResourcePackUnderThreshold.VANILLA_TEXTURES.slice(0, entry.overriddenCount)) {
            files[packRoot + "/" + path] = ImageBytes.png({ width: 16, height: 16 });
        }

        files[packRoot + "/textures/ui/custom.png"] = ImageBytes.png({ width: 16, height: 16 });

        return ModelFixture.findings(new MashupCoverageLow(), files, {
            contentType: "world",
            vanilla: MashupCoverageLowReportsGlobalResourcePackUnderThreshold.vanilla(),
        });
    }

    private static vanilla(): VanillaData {
        const files: Record<string, string> = {};

        for (const path of MashupCoverageLowReportsGlobalResourcePackUnderThreshold.VANILLA_TEXTURES) {
            files[path] = "hash";
        }

        files["textures/ui/vanilla_ui.png"] = "hash";

        return { files, properties: {} };
    }
}
