import type { Finding } from "../../src/Types/CheckTypes.js";
import type { UnknownCommandReportsCommandBlockWithUnknownCommandCase } from "../Types/UnknownCommandReportsCommandBlockWithUnknownCommandTypes.js";
import UnknownCommand from "../../src/Checks/Chunk/UnknownCommand.js";
import ModelFixture from "./Core/ModelFixture.js";
import CommandBlockWorld from "./World/CommandBlockWorld.js";

export default abstract class UnknownCommandReportsCommandBlockWithUnknownCommand {
    static readonly ID = "CHUNK/201";
    static readonly CASES: readonly UnknownCommandReportsCommandBlockWithUnknownCommandCase[] = [
        { name: "/say hello is a built in command", command: "/say hello", version: 40, source: "block", expectedIds: [] },
        { name: "tp without a slash is a built in command", command: "tp @a 0 0 0", version: 40, source: "block", expectedIds: [] },
        { name: "an empty command has no command to check", command: "", version: 40, source: "block", expectedIds: [] },
        {
            name: "/mypack:custom is namespaced and is not checked",
            command: "/mypack:custom",
            version: 40,
            source: "block",
            expectedIds: [],
        },
        {
            name: "/frobnicate is not a built in command",
            command: "/frobnicate now",
            version: 40,
            source: "block",
            expectedIds: ["CHUNK/201"],
        },
        {
            name: "minecart /frobnicate is not a built in command",
            command: "/frobnicate",
            version: 1,
            source: "minecart",
            expectedIds: ["CHUNK/201"],
        },
    ];

    static async run(entry: UnknownCommandReportsCommandBlockWithUnknownCommandCase): Promise<Finding[]> {
        return ModelFixture.findings(new UnknownCommand(), CommandBlockWorld.files(entry), { contentType: "world" });
    }
}
