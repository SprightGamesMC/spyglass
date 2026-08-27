export interface CommandSource {
    readonly path: string;
    readonly pack: string;
    readonly line?: number;
    readonly command: string;
    readonly name: string;
    readonly leadingSlash: boolean;
}
