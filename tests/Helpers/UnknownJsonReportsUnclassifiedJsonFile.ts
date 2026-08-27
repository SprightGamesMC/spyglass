import type { Finding } from "../../src/Types/CheckTypes.js";
import type { UnknownJsonReportsUnclassifiedJsonFileCase } from "../Types/UnknownJsonReportsUnclassifiedJsonFileTypes.js";
import UnknownJson from "../../src/Checks/Pack/UnknownJson.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class UnknownJsonReportsUnclassifiedJsonFile {
    static readonly ID = "PACK/202";
    static readonly CASES: readonly UnknownJsonReportsUnclassifiedJsonFileCase[] = [
        { name: "entities/zombie.json classifies as an entity", packPath: "entities/zombie.json", expectFinding: false },
        { name: "entity/zombie.json is in a folder that maps to no file type", packPath: "entity/zombie.json", expectFinding: true },
        { name: "notes.json at the pack root maps to no file type", packPath: "notes.json", expectFinding: true },
        { name: "mystery/thing.png is not a JSON file", packPath: "mystery/thing.png", expectFinding: false },
        {
            name: "atmospherics folder is a known resource pack type",
            packPath: "atmospherics/hot.atm.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "local_lighting folder is a known resource pack type",
            packPath: "local_lighting/local_lighting.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "textures/ui/button.json is a UI file next to its image",
            packPath: "textures/ui/button.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "textures/textures_list.json is an accepted spelling",
            packPath: "textures/textures_list.json",
            expectFinding: false,
            packType: "resource",
        },
        { name: "atmospherics folder in a behavior pack maps to no file type", packPath: "atmospherics/hot.atm.json", expectFinding: true },
        {
            name: "color_grading folder is a known resource pack type",
            packPath: "color_grading/hot.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "lighting folder is a known resource pack type",
            packPath: "lighting/global.json",
            expectFinding: false,
            packType: "resource",
        },
        { name: "pbr folder is a known resource pack type", packPath: "pbr/global.json", expectFinding: false, packType: "resource" },
        {
            name: "point_lights folder is a known resource pack type",
            packPath: "point_lights/global.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "shadows folder is a known resource pack type",
            packPath: "shadows/global.json",
            expectFinding: false,
            packType: "resource",
        },
        { name: "water folder is a known resource pack type", packPath: "water/water.json", expectFinding: false, packType: "resource" },
        {
            name: "texts/language_names.json is the game language name list so it is a known file",
            packPath: "texts/language_names.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "texts/languages_names.json is the other spelling of the same file and is known",
            packPath: "texts/languages_names.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "biomes_client.json at the resource pack root is a known file",
            packPath: "biomes_client.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "splashes.json at the resource pack root is the title screen text list",
            packPath: "splashes.json",
            expectFinding: false,
            packType: "resource",
        },
        {
            name: "loading_messages.json at the resource pack root is the loading text list",
            packPath: "loading_messages.json",
            expectFinding: false,
            packType: "resource",
        },
    ];

    static run(packPath: string, packType: "behavior" | "resource" = "behavior"): Promise<Finding[]> {
        const files =
            packType === "resource"
                ? { "RP/manifest.json": ModelFixture.resourceManifest(), ["RP/" + packPath]: "{}" }
                : { "BP/manifest.json": ModelFixture.behaviorManifest(), ["BP/" + packPath]: "{}" };
        return ModelFixture.findings(new UnknownJson(), files);
    }
}
