import type { Finding } from "../../src/Types/CheckTypes.js";
import type { CommandFileKind, UnknownCommandCase } from "../Types/UnknownCommandReportsUnlistedCommandTypes.js";
import UnknownCommand from "../../src/Checks/Script/UnknownCommand.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class UnknownCommandReportsUnlistedCommand {
    static readonly ID = "SCRIPT/201";
    static readonly FUNCTION_PATH = "BP/functions/start.mcfunction";
    static readonly DIALOGUE_PATH = "BP/dialogue/talk.json";
    static readonly CASES: readonly UnknownCommandCase[] = [
        {
            name: "say, tp, and execute are built in commands",
            source: "mcfunction",
            lines: ["say hi", "/tp @s 0 0 0", "# comment", "", "execute as @a run say x"],
            expectedMessages: [],
            expectedLines: [],
        },
        {
            name: "custom:thing is namespaced and is not checked",
            source: "mcfunction",
            lines: ["custom:thing run"],
            expectedMessages: [],
            expectedLines: [],
        },
        {
            name: "frobnicate and zap are not built in commands",
            source: "mcfunction",
            lines: ["say hi", "frobnicate @s", "/zap"],
            expectedMessages: ["Command frobnicate is not a built in command", "Command zap is not a built in command"],
            expectedLines: [2, 3],
        },
        {
            name: "/frobnicate in a dialogue command list is not a built in command and has no line",
            source: "dialogue",
            lines: ["/say hi", "/frobnicate"],
            expectedMessages: ["Command frobnicate is not a built in command"],
            expectedLines: [undefined],
        },
    ];

    static pathFor(source: CommandFileKind): string {
        return source === "mcfunction"
            ? UnknownCommandReportsUnlistedCommand.FUNCTION_PATH
            : UnknownCommandReportsUnlistedCommand.DIALOGUE_PATH;
    }

    static async run(entry: UnknownCommandCase): Promise<Finding[]> {
        const content =
            entry.source === "mcfunction"
                ? entry.lines.join("\n")
                : {
                      format_version: "1.17.0",
                      "minecraft:npc_dialogue": { scenes: [{ scene_tag: "a", on_open_commands: entry.lines }] },
                  };
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            [UnknownCommandReportsUnlistedCommand.pathFor(entry.source)]: content,
        };

        return ModelFixture.findings(new UnknownCommand(), files);
    }

    static lines(findings: readonly Finding[]): (number | undefined)[] {
        return findings.map((finding) => finding.location?.line);
    }
}
