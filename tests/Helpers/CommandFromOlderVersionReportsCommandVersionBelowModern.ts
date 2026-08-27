import type { Finding } from "../../src/Types/CheckTypes.js";
import type { CommandFromOlderVersionReportsCommandVersionBelowModernCase } from "../Types/CommandFromOlderVersionReportsCommandVersionBelowModernTypes.js";
import CommandFromOlderVersion from "../../src/Checks/Chunk/CommandFromOlderVersion.js";
import ModelFixture from "./Core/ModelFixture.js";
import CommandBlockWorld from "./World/CommandBlockWorld.js";

export default abstract class CommandFromOlderVersionReportsCommandVersionBelowModern {
    static readonly ID = "CHUNK/501";
    static readonly CASES: readonly CommandFromOlderVersionReportsCommandVersionBelowModernCase[] = [
        { name: "command version 40 is not older than 1.20.0", command: "/say hi", version: 40, source: "block", expectedIds: [] },
        { name: "a command block with no version field is not checked", command: "/say hi", source: "block", expectedIds: [] },
        { name: "command version 20 is older than 1.20.0", command: "/say hi", version: 20, source: "block", expectedIds: ["CHUNK/501"] },
        {
            name: "minecart command version 1 is older than 1.20.0",
            command: "/say hi",
            version: 1,
            source: "minecart",
            expectedIds: ["CHUNK/501"],
        },
    ];

    static async run(entry: CommandFromOlderVersionReportsCommandVersionBelowModernCase): Promise<Finding[]> {
        return ModelFixture.findings(new CommandFromOlderVersion(), CommandBlockWorld.files(entry), { contentType: "world" });
    }
}
