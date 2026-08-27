import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackType } from "../../src/Types/ModelTypes.js";
import type { FileNameBlockedReportsReservedGameFileCase } from "../Types/FileNameBlockedReportsReservedGameFileTypes.js";
import FileNameBlocked from "../../src/Checks/Pack/FileNameBlocked.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class FileNameBlockedReportsReservedGameFile {
    static readonly ID = "PACK/203";
    static readonly ROOT = "pack";
    static readonly CASES: readonly FileNameBlockedReportsReservedGameFileCase[] = [
        {
            name: "textures/a.png in a resource pack is not a reserved name",
            packType: "resource",
            packPath: "textures/a.png",
            expectFinding: false,
        },
        {
            name: "font/emoticons.json in a resource pack is reserved by the game",
            packType: "resource",
            packPath: "font/emoticons.json",
            expectFinding: true,
        },
        {
            name: "other/emoticons.json in a resource pack is outside font so it is not reserved",
            packType: "resource",
            packPath: "other/emoticons.json",
            expectFinding: false,
        },
        {
            name: "shaders/glsl/a.glsl in a resource pack is inside the reserved shaders folder",
            packType: "resource",
            packPath: "shaders/glsl/a.glsl",
            expectFinding: true,
        },
        {
            name: "ui/mcoin.png in a resource pack is reserved by the game",
            packType: "resource",
            packPath: "ui/mcoin.png",
            expectFinding: true,
        },
        {
            name: "sub/Contents.json in a resource pack is reserved at any depth",
            packType: "resource",
            packPath: "sub/Contents.json",
            expectFinding: true,
        },
        {
            name: "signatures.json in a resource pack is reserved by the store",
            packType: "resource",
            packPath: "signatures.json",
            expectFinding: true,
        },
        {
            name: "texts/language_names.json in a resource pack is a vanilla file that only ADDON/701 blocks",
            packType: "resource",
            packPath: "texts/language_names.json",
            expectFinding: false,
        },
        {
            name: "texts/languages_names.json in a resource pack is reserved by the game",
            packType: "resource",
            packPath: "texts/languages_names.json",
            expectFinding: true,
        },
        {
            name: "splashes.json in a resource pack is allowed because only an add-on may not contain it",
            packType: "resource",
            packPath: "splashes.json",
            expectFinding: false,
        },
        {
            name: "texts/languages.json in a resource pack is the pack language list so it is not reserved",
            packType: "resource",
            packPath: "texts/languages.json",
            expectFinding: false,
        },
        {
            name: "ui/mcoin.png inside a subpack is reserved at the path the subpack provides",
            packType: "resource",
            packPath: "subpacks/tier2/ui/mcoin.png",
            expectFinding: true,
        },
        {
            name: "items_client.json in a behavior pack is reserved by the game",
            packType: "behavior",
            packPath: "items_client.json",
            expectFinding: true,
        },
        {
            name: "root contents.json in a skin pack is reserved by the game",
            packType: "skin",
            packPath: "contents.json",
            expectFinding: true,
        },
        {
            name: "sub/contents.json in a skin pack is not at the root so it is not reserved",
            packType: "skin",
            packPath: "sub/contents.json",
            expectFinding: false,
        },
        { name: "ui/mcoin.png in a skin pack is reserved by the game", packType: "skin", packPath: "ui/mcoin.png", expectFinding: true },
        {
            name: "root contents.json in a persona pack is allowed because the store adds it",
            packType: "persona",
            packPath: "contents.json",
            expectFinding: false,
        },
        {
            name: "root signatures.json in a persona pack is allowed because the store adds it",
            packType: "persona",
            packPath: "signatures.json",
            expectFinding: false,
        },
    ];

    static run(packType: PackType, packPath: string): Promise<Finding[]> {
        const root = FileNameBlockedReportsReservedGameFile.ROOT;
        const files = {
            [root + "/manifest.json"]: ModelFixture.manifestFor(packType),
            [root + "/" + packPath]: "x",
        };
        return ModelFixture.findings(new FileNameBlocked(), files);
    }
}
