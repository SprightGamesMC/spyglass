export interface ArchiveFixture {
    readonly files: Readonly<Record<string, string>>;
    readonly deflate: boolean;
}
