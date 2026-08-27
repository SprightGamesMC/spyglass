import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { FileUnreadableReportsFailedReadCase } from "../Types/FileUnreadableReportsFailedReadTypes.js";
import FileUnreadable from "../../src/Checks/File/FileUnreadable.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class FileUnreadableReportsFailedRead {
    static readonly ID = "FILE/207";
    static readonly JSON_PATH = "BP/entities/thing.json";
    static readonly BINARY_PATH = "BP/structures/thing.mcstructure";
    static readonly CASES: readonly FileUnreadableReportsFailedReadCase[] = [
        { name: "every file readable gives no read error", unreadable: [], expectedIds: [], expectedPaths: [] },
        {
            name: "entities/thing.json whose bytes cannot be read is a read error",
            unreadable: [FileUnreadableReportsFailedRead.JSON_PATH],
            expectedIds: ["FILE/207"],
            expectedPaths: [FileUnreadableReportsFailedRead.JSON_PATH],
        },
        {
            name: "structures/thing.mcstructure whose bytes cannot be read is a read error",
            unreadable: [FileUnreadableReportsFailedRead.BINARY_PATH],
            expectedIds: ["FILE/207"],
            expectedPaths: [FileUnreadableReportsFailedRead.BINARY_PATH],
        },
        {
            name: "json and mcstructure files that cannot be read are each a read error",
            unreadable: [FileUnreadableReportsFailedRead.JSON_PATH, FileUnreadableReportsFailedRead.BINARY_PATH],
            expectedIds: ["FILE/207", "FILE/207"],
            expectedPaths: [FileUnreadableReportsFailedRead.JSON_PATH, FileUnreadableReportsFailedRead.BINARY_PATH],
        },
    ];

    static run(entry: FileUnreadableReportsFailedReadCase): Promise<FindingSummary> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            [FileUnreadableReportsFailedRead.JSON_PATH]: "{}",
            [FileUnreadableReportsFailedRead.BINARY_PATH]: new Uint8Array([1, 2, 3]),
        };
        return ModelFixture.summary(new FileUnreadable(), files, { unreadable: entry.unreadable });
    }
}
