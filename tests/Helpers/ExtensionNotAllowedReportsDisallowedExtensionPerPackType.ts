import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackType } from "../../src/Types/ModelTypes.js";
import type { ExtensionNotAllowedReportsDisallowedExtensionPerPackTypeCase } from "../Types/ExtensionNotAllowedReportsDisallowedExtensionPerPackTypeTypes.js";
import ExtensionNotAllowed from "../../src/Checks/Pack/ExtensionNotAllowed.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ExtensionNotAllowedReportsDisallowedExtensionPerPackType {
    static readonly ID = "PACK/201";
    static readonly ROOT = "pack";
    static readonly CASES: readonly ExtensionNotAllowedReportsDisallowedExtensionPerPackTypeCase[] = [
        { name: "js in a behavior pack is an allowed extension", packType: "behavior", fileName: "scripts/main.js", expectFinding: false },
        {
            name: "js in a resource pack is not an allowed extension",
            packType: "resource",
            fileName: "scripts/main.js",
            expectFinding: true,
        },
        { name: "png in a resource pack is an allowed extension", packType: "resource", fileName: "textures/a.png", expectFinding: false },
        { name: "exe in a behavior pack is not an allowed extension", packType: "behavior", fileName: "tool.exe", expectFinding: true },
        {
            name: "README without an extension in a behavior pack is not allowed",
            packType: "behavior",
            fileName: "README",
            expectFinding: true,
        },
        { name: "jpg in a skin pack is an allowed extension", packType: "skin", fileName: "skin.jpg", expectFinding: false },
        {
            name: "mcstructure in a skin pack is not an allowed extension",
            packType: "skin",
            fileName: "a.mcstructure",
            expectFinding: true,
        },
        { name: "jpg in a persona pack is not an allowed extension", packType: "persona", fileName: "a.jpg", expectFinding: true },
        { name: "tga in a persona pack is an allowed extension", packType: "persona", fileName: "a.tga", expectFinding: false },
        {
            name: "ldb in a world template is allowed because templates have no extension restriction",
            packType: "world_template",
            fileName: "db/000001.ldb",
            expectFinding: false,
        },
    ];

    static run(packType: PackType, fileName: string): Promise<Finding[]> {
        const root = ExtensionNotAllowedReportsDisallowedExtensionPerPackType.ROOT;
        const files = {
            [root + "/manifest.json"]: ModelFixture.manifestFor(packType),
            [root + "/" + fileName]: "x",
        };
        return ModelFixture.findings(new ExtensionNotAllowed(), files);
    }
}
