export default abstract class MinecraftCommands {
    private static readonly BUILT_IN: readonly string[] = [
        "aimassist",
        "allowlist",
        "alwaysday",
        "camera",
        "camerashake",
        "changesetting",
        "clear",
        "clearspawnpoint",
        "clone",
        "commandbuilder",
        "connect",
        "controlscheme",
        "damage",
        "daylock",
        "deop",
        "dialogue",
        "difficulty",
        "effect",
        "enchant",
        "event",
        "execute",
        "fill",
        "fog",
        "function",
        "gamemode",
        "gamerule",
        "gametest",
        "give",
        "help",
        "hud",
        "inputpermission",
        "kick",
        "kill",
        "list",
        "locate",
        "loot",
        "me",
        "msg",
        "mobevent",
        "music",
        "op",
        "ops",
        "particle",
        "permission",
        "place",
        "playanimation",
        "playsound",
        "project",
        "recipe",
        "reload",
        "reloadconfig",
        "reloadpacketlimitconfig",
        "replaceitem",
        "ride",
        "save",
        "say",
        "schedule",
        "scoreboard",
        "script",
        "scriptevent",
        "sendshowstoreoffer",
        "setblock",
        "setmaxplayers",
        "setworldspawn",
        "simulationtype",
        "spawnpoint",
        "spreadplayers",
        "stop",
        "stopsound",
        "structure",
        "summon",
        "tag",
        "teleport",
        "tell",
        "tellraw",
        "testfor",
        "testforblock",
        "testforblocks",
        "tickingarea",
        "tp",
        "time",
        "title",
        "titleraw",
        "toggledownfall",
        "transfer",
        "volumearea",
        "weather",
        "wsserver",
        "whitelist",
        "?",
        "w",
        "xp",
    ];
    private static readonly WORLD_IMPACTING: readonly string[] = [
        "allowlist",
        "alwaysday",
        "changesetting",
        "connect",
        "daylock",
        "deop",
        "difficulty",
        "gamemode",
        "gamerule",
        "gametest",
        "help",
        "kick",
        "list",
        "locate",
        "op",
        "ops",
        "permission",
        "project",
        "reload",
        "reloadconfig",
        "save",
        "script",
        "setmaxplayers",
        "setworldspawn",
        "simulationtype",
        "stop",
        "tickingarea",
        "time",
        "transfer",
        "wsserver",
        "whitelist",
        "?",
    ];

    static isBuiltIn(name: string): boolean {
        return MinecraftCommands.BUILT_IN.includes(name.toLowerCase());
    }

    static isWorldImpacting(name: string): boolean {
        return MinecraftCommands.WORLD_IMPACTING.includes(name.toLowerCase());
    }

    static isNamespaced(name: string): boolean {
        return name.includes(":");
    }

    static commandName(line: string): string | undefined {
        const trimmed = line.trim().replace(/^\//, "");

        if (trimmed === "" || trimmed.startsWith("#")) {
            return undefined;
        }

        const match = /^([^\s]+)/.exec(trimmed);

        return match === null ? undefined : match[1].toLowerCase();
    }
}
