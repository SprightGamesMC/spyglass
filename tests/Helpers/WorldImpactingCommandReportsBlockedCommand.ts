import type { WorldImpactingCommandReportsBlockedCommandCase } from "../Types/WorldImpactingCommandReportsBlockedCommandTypes.js";
import WorldImpactingCommand from "../../src/Checks/Addon/WorldImpactingCommand.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class WorldImpactingCommandReportsBlockedCommand {
    static readonly ID = "ADDON/703";
    static readonly CASES: readonly WorldImpactingCommandReportsBlockedCommandCase[] = [
        {
            name: "say and tp in a function do not change global world state",
            path: AddonFixture.BP + "functions/spright_cave/a.mcfunction",
            content: "say hello\ntp @s 0 0 0\n",
            expectedLines: [],
        },
        {
            name: "gamerule and time in a function change global world state",
            path: AddonFixture.BP + "functions/spright_cave/a.mcfunction",
            content: "# comment\ngamerule doDaylightCycle false\nsay ok\n/time set day\n",
            expectedLines: [2, 4],
        },
        {
            name: "difficulty in a dialogue command list changes global world state",
            path: AddonFixture.BP + "dialogue/spright_cave/npc.json",
            content: { "minecraft:npc_dialogue": { scenes: [{ on_open_commands: ["/difficulty peaceful"] }] } },
            expectedLines: [undefined],
        },
    ];

    static async run(entry: WorldImpactingCommandReportsBlockedCommandCase): Promise<(number | undefined)[]> {
        const files = {
            [AddonFixture.BP + "manifest.json"]: ModelFixture.behaviorManifest(),
            [entry.path]: entry.content,
        };
        const result = await ModelFixture.run(new WorldImpactingCommand(), files, { layout: "marketplace" });

        return result.findings.map((finding) => finding.location?.line);
    }
}
