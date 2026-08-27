import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { WorldRequiredFilesReportsMissingFileCase } from "../Types/WorldRequiredFilesReportsMissingFileTypes.js";
import DatabaseMissing from "../../src/Checks/World/DatabaseMissing.js";
import LevelnameMissing from "../../src/Checks/World/LevelnameMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import NbtWriter from "./World/NbtWriter.js";

export default abstract class WorldRequiredFilesReportsMissingFile {
    static readonly LEVELNAME_ID = "WORLD/105";
    static readonly DATABASE_ID = "WORLD/106";
    static readonly ROOT = "World";
    static readonly CASES: readonly WorldRequiredFilesReportsMissingFileCase[] = [
        {
            name: "world with levelname.txt and a db file has both required files",
            includeLevelname: true,
            includeDatabase: true,
            expectedIds: [],
        },
        {
            name: "world without levelname.txt is missing the world name file",
            includeLevelname: false,
            includeDatabase: true,
            expectedIds: ["WORLD/105"],
        },
        {
            name: "world with an empty db folder has no chunk data files",
            includeLevelname: true,
            includeDatabase: false,
            expectedIds: ["WORLD/106"],
        },
    ];

    static async run(entry: WorldRequiredFilesReportsMissingFileCase): Promise<Finding[]> {
        const root = WorldRequiredFilesReportsMissingFile.ROOT;
        const files: Record<string, FixtureFiles[string]> = {
            [root + "/manifest.json"]: ModelFixture.worldTemplateManifest(),
            [root + "/level.dat"]: NbtWriter.levelDat([NbtWriter.string("LevelName", "Test")]),
        };

        if (entry.includeLevelname) {
            files[root + "/levelname.txt"] = "Test";
        }

        if (entry.includeDatabase) {
            files[root + "/db/000001.log"] = new Uint8Array([0]);
        }

        const levelname = await ModelFixture.findings(new LevelnameMissing(), files as FixtureFiles, { contentType: "world" });
        const database = await ModelFixture.findings(new DatabaseMissing(), files as FixtureFiles, { contentType: "world" });

        return [...levelname, ...database];
    }
}
