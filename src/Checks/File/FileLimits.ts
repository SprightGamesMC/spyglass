export default abstract class FileLimits {
    static readonly PATH_LENGTH_LIMIT = 80;
    static readonly PATH_DEPTH_LIMIT = 7;
    static readonly UPPERCASE_EXEMPT_EXTENSIONS: readonly string[] = ["lang"];
    static readonly UPPERCASE_EXEMPT_FOLDERS: readonly string[] = ["texts", "scripts", "db", "font"];
    static readonly INVALID_CHARACTERS = /[$<>:"|?*]/;
    static readonly CONTROL_CHARACTER_LIMIT = 31;
    static readonly RESERVED_NAMES: readonly string[] = [
        "CON",
        "PRN",
        "AUX",
        "NUL",
        "COM1",
        "COM2",
        "COM3",
        "COM4",
        "COM5",
        "COM6",
        "COM7",
        "COM8",
        "COM9",
        "LPT1",
        "LPT2",
        "LPT3",
        "LPT4",
        "LPT5",
        "LPT6",
        "LPT7",
        "LPT8",
        "LPT9",
    ];
}
