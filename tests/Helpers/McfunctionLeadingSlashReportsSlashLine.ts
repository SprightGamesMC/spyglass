import type { Finding } from "../../src/Types/CheckTypes.js";
import type { LeadingSlashCase } from "../Types/McfunctionLeadingSlashReportsSlashLineTypes.js";
import McfunctionLeadingSlash from "../../src/Checks/Script/McfunctionLeadingSlash.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class McfunctionLeadingSlashReportsSlashLine {
    static readonly ID = "SCRIPT/202";
    static readonly FUNCTION_PATH = "BP/functions/start.mcfunction";
    static readonly CASES: readonly LeadingSlashCase[] = [
        {
            name: "commands without a leading slash and a comment line are valid mcfunction lines",
            functionText: "say hi\n\n# note\nexecute as @a run say x",
            expectedLines: [],
        },
        {
            name: "lines 1 and 4 beginning with a slash are not valid mcfunction commands",
            functionText: "/say hi\nsay two\n\n  /tp @s 0 0 0",
            expectedLines: [1, 4],
        },
    ];

    static run(functionText: string): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            [McfunctionLeadingSlashReportsSlashLine.FUNCTION_PATH]: functionText,
            "BP/dialogue/talk.json": {
                format_version: "1.17.0",
                "minecraft:npc_dialogue": { scenes: [{ scene_tag: "a", on_open_commands: ["/say hi"] }] },
            },
        };

        return ModelFixture.findings(new McfunctionLeadingSlash(), files);
    }

    static lines(findings: readonly Finding[]): number[] {
        return findings.map((finding) => finding.location?.line ?? -1);
    }
}
