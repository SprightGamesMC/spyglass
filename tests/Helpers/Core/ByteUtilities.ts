export default abstract class ByteUtilities {
    private static readonly CRC_POLYNOMIAL = 0xedb88320;
    private static readonly CRC_TABLE = ByteUtilities.buildCrcTable();

    static crc32(bytes: Uint8Array): number {
        let crc = 0xffffffff;

        for (const byte of bytes) {
            crc = ByteUtilities.CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
        }

        return (crc ^ 0xffffffff) >>> 0;
    }

    static concat(parts: readonly Uint8Array[]): Uint8Array {
        const total = parts.reduce((sum, part) => sum + part.length, 0);
        const output = new Uint8Array(total);
        let offset = 0;

        for (const part of parts) {
            output.set(part, offset);
            offset += part.length;
        }

        return output;
    }

    private static buildCrcTable(): Uint32Array {
        const table = new Uint32Array(256);

        for (let index = 0; index < 256; index += 1) {
            let value = index;

            for (let bit = 0; bit < 8; bit += 1) {
                value = value & 1 ? ByteUtilities.CRC_POLYNOMIAL ^ (value >>> 1) : value >>> 1;
            }

            table[index] = value >>> 0;
        }

        return table;
    }
}
