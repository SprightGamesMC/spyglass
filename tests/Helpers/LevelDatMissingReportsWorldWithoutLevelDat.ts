import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { LevelDatCase } from "../Types/LevelDatMissingReportsWorldWithoutLevelDatTypes.js";
import LevelDatMissing from "../../src/Checks/World/LevelDatMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import NbtWriter from "./World/NbtWriter.js";

export default abstract class LevelDatMissingReportsWorldWithoutLevelDat {
    static readonly ID = "WORLD/101";
    static readonly CASES: readonly LevelDatCase[] = [
        { name: "world with a parseable level.dat can be loaded", levelDat: "valid" },
        { name: "world with only level.dat_old still counts as having level.dat", levelDat: "old_only" },
        { name: "world without level.dat or level.dat_old has no level.dat", levelDat: "absent", expectedPath: "World" },
        { name: "world with 12 random bytes as level.dat cannot be loaded", levelDat: "random", expectedPath: "World/level.dat" },
    ];

    static async run(entry: LevelDatCase): Promise<Finding[]> {
        const files: Record<string, FixtureFiles[string]> = { "World/manifest.json": ModelFixture.worldTemplateManifest() };
        const valid = NbtWriter.levelDat([NbtWriter.string("LevelName", "Test")]);

        if (entry.levelDat === "valid") {
            files["World/level.dat"] = valid;
        }

        if (entry.levelDat === "old_only") {
            files["World/level.dat_old"] = valid;
        }

        if (entry.levelDat === "random") {
            files["World/level.dat"] = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        }

        return ModelFixture.findings(new LevelDatMissing(), files, { contentType: "world" });
    }
}
