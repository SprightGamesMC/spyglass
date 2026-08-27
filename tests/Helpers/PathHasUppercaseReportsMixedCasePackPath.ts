import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PathHasUppercaseReportsMixedCasePackPathCase } from "../Types/PathHasUppercaseReportsMixedCasePackPathTypes.js";
import PathHasUppercase from "../../src/Checks/File/PathHasUppercase.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class PathHasUppercaseReportsMixedCasePackPath {
    static readonly ID = "FILE/205";
    static readonly PACK_ROOT = "Content/behavior_packs/BP_Test";
    static readonly CASES: readonly PathHasUppercaseReportsMixedCasePackPathCase[] = [
        { name: "entities/zombie.json has no uppercase letters", path: "entities/zombie.json", expectFinding: false },
        { name: "uppercase BP_Test pack folder name is outside the measured pack path", path: "items/sword.json", expectFinding: false },
        { name: "Zombie.json file name contains an uppercase letter", path: "entities/Zombie.json", expectFinding: true },
        { name: "Entities folder name contains an uppercase letter", path: "Entities/zombie.json", expectFinding: true },
        { name: "en_US.lang is exempt because lang files keep locale casing", path: "texts/en_US.lang", expectFinding: false },
        { name: "texts folder is exempt from the uppercase rule", path: "texts/Languages.json", expectFinding: false },
        { name: "scripts folder is exempt from the uppercase rule", path: "scripts/Main.js", expectFinding: false },
        { name: "db folder is exempt from the uppercase rule", path: "db/CURRENT", expectFinding: false },
        { name: "font folder is exempt because glyph files use uppercase hex", path: "font/glyph_E1.png", expectFinding: false },
        {
            name: "greyBorder.png matches a vanilla path ignoring case and is exempt",
            path: "textures/ui/greyBorder.png",
            vanilla: true,
            expectFinding: false,
        },
        { name: "greyBorder.png with no vanilla match is reported", path: "textures/ui/greyBorder.png", expectFinding: true },
        {
            name: "Piece.png inside a persona pack is left to the persona texture name check",
            path: "Piece.png",
            persona: true,
            expectFinding: false,
        },
    ];

    static run(entry: PathHasUppercaseReportsMixedCasePackPathCase): Promise<Finding[]> {
        const root = PathHasUppercaseReportsMixedCasePackPath.PACK_ROOT;
        const manifest = entry.persona === true ? ModelFixture.personaManifest() : ModelFixture.behaviorManifest();
        const files = { [root + "/manifest.json"]: manifest, [root + "/" + entry.path]: "{}" };
        const vanilla = entry.vanilla === true ? { files: { "textures/ui/greyborder.png": "abc" }, properties: {} } : undefined;
        return ModelFixture.findings(new PathHasUppercase(), files, { vanilla });
    }

    static runOutsidePack(path: string): Promise<Finding[]> {
        return ModelFixture.findings(new PathHasUppercase(), { [path]: "x" });
    }
}
