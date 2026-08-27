export interface TextReadCase {
    readonly name: string;
    readonly path: string;
    readonly unreadable: boolean;
    readonly expectedStatus: "ok" | "unreadable";
    readonly expectedLines?: readonly string[];
}
