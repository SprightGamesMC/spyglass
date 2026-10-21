import type { PathPatternCase } from "../Types/PathPatternMatchesWholePathTypes.js";
import PathPattern from "../../src/Cli/PathPattern.js";

export default abstract class PathPatternMatchesWholePath {
    static readonly CASES: readonly PathPatternCase[] = [
        { name: "exact path RP/textures/a.png matches itself", pattern: "RP/textures/a.png", path: "RP/textures/a.png", matches: true },
        {
            name: "exact path RP/textures/a.png does not match a longer path because the whole path must match",
            pattern: "RP/textures/a.png",
            path: "RP/textures/a.png.bak",
            matches: false,
        },
        {
            name: "star matches characters inside one folder name",
            pattern: "RP/textures/boss_*.png",
            path: "RP/textures/boss_phase_1.png",
            matches: true,
        },
        {
            name: "star does not match a slash so a file in a deeper folder is not matched",
            pattern: "RP/textures/*.png",
            path: "RP/textures/entity/a.png",
            matches: false,
        },
        {
            name: "double star matches across folders",
            pattern: "RP/**.png",
            path: "RP/textures/entity/a.png",
            matches: true,
        },
        {
            name: "double star followed by a slash also matches no folder",
            pattern: "RP/**/a.png",
            path: "RP/a.png",
            matches: true,
        },
        { name: "question mark matches one character", pattern: "RP/a?.png", path: "RP/a1.png", matches: true },
        { name: "question mark does not match a slash", pattern: "RP?a.png", path: "RP/a.png", matches: false },
        { name: "dot in the pattern is a literal dot and not any character", pattern: "RP/a.png", path: "RP/axpng", matches: false },
        { name: "backslash in the pattern is read as a slash", pattern: "RP\\textures\\a.png", path: "RP/textures/a.png", matches: true },
        { name: "matching is case sensitive", pattern: "rp/textures/a.png", path: "RP/textures/a.png", matches: false },
    ];

    static matches(entry: PathPatternCase): boolean {
        return PathPattern.matches(entry.pattern, entry.path);
    }
}
