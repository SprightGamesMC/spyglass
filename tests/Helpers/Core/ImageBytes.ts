import type { GifOptions, JpegOptions, PngOptions, PsdOptions, TgaOptions } from "../../Types/Core/FixtureTypes.js";
import zlib from "node:zlib";
import ImageMetadataReader from "../../../src/Loaders/ImageMetadataReader.js";
import ByteUtilities from "./ByteUtilities.js";

export default abstract class ImageBytes {
    static png(options: PngOptions): Uint8Array {
        const colorType = options.alpha === false ? 2 : 6;
        const channels = colorType === 6 ? 4 : 3;
        const pixels = new Uint8Array(options.height * (1 + options.width * channels));
        const compressed = zlib.deflateSync(pixels);
        const header = new Uint8Array(13);
        const view = new DataView(header.buffer);

        view.setUint32(0, options.width, false);
        view.setUint32(4, options.height, false);
        header[8] = 8;
        header[9] = colorType;

        const chunks = [ImageBytes.pngChunk("IHDR", header)];

        if (options.dpi !== undefined) {
            const density = new Uint8Array(9);
            const densityView = new DataView(density.buffer);
            const perMeter = Math.round(options.dpi / ImageMetadataReader.METERS_PER_INCH);

            densityView.setUint32(0, perMeter, false);
            densityView.setUint32(4, perMeter, false);
            density[8] = 1;
            chunks.push(ImageBytes.pngChunk("pHYs", density));
        }

        chunks.push(ImageBytes.pngChunk("IDAT", new Uint8Array(compressed)), ImageBytes.pngChunk("IEND", new Uint8Array(0)));

        return ByteUtilities.concat([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ...chunks]);
    }

    static jpeg(options: JpegOptions): Uint8Array {
        const app0 = new Uint8Array([
            0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
        ]);

        if (options.dpi !== undefined) {
            app0[11] = 1;
            app0[12] = (options.dpi >> 8) & 0xff;
            app0[13] = options.dpi & 0xff;
            app0[14] = (options.dpi >> 8) & 0xff;
            app0[15] = options.dpi & 0xff;
        }

        const frame = new Uint8Array([
            0xff, 0xc0, 0x00, 0x11, 0x08, 0, 0, 0, 0, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        ]);

        frame[5] = (options.height >> 8) & 0xff;
        frame[6] = options.height & 0xff;
        frame[7] = (options.width >> 8) & 0xff;
        frame[8] = options.width & 0xff;

        return ByteUtilities.concat([
            new Uint8Array([0xff, 0xd8]),
            app0,
            frame,
            new Uint8Array([0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xff, 0xd9]),
        ]);
    }

    static gif(options: GifOptions): Uint8Array {
        const bytes = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0, 0, 0, 0, 0x00, 0x00, 0x00, 0x3b]);

        bytes[6] = options.width & 0xff;
        bytes[7] = (options.width >> 8) & 0xff;
        bytes[8] = options.height & 0xff;
        bytes[9] = (options.height >> 8) & 0xff;

        return bytes;
    }

    static tga(options: TgaOptions): Uint8Array {
        const header = new Uint8Array(18);

        header[2] = 2;
        header[12] = options.width & 0xff;
        header[13] = (options.width >> 8) & 0xff;
        header[14] = options.height & 0xff;
        header[15] = (options.height >> 8) & 0xff;
        header[16] = options.alpha === false ? 24 : 32;
        header[17] = options.alpha === false ? 0 : 8;

        return ByteUtilities.concat([header, new Uint8Array(options.width * options.height * (options.alpha === false ? 3 : 4))]);
    }

    static psd(options: PsdOptions): Uint8Array {
        const header = new Uint8Array(26);
        const view = new DataView(header.buffer);

        header.set([0x38, 0x42, 0x50, 0x53]);
        view.setUint16(4, 1, false);
        view.setUint16(12, 3, false);
        view.setUint32(14, options.height, false);
        view.setUint32(18, options.width, false);
        view.setUint16(22, 8, false);
        view.setUint16(24, 3, false);

        const colorMode = new Uint8Array(4);
        const resources = options.dpi === undefined ? new Uint8Array(4) : ImageBytes.psdResolutionResource(options.dpi);

        return ByteUtilities.concat([header, colorMode, resources, new Uint8Array(4)]);
    }

    private static psdResolutionResource(dpi: number): Uint8Array {
        const block = new Uint8Array(4 + 12 + 16);
        const view = new DataView(block.buffer);

        view.setUint32(0, 12 + 16, false);
        block.set([0x38, 0x42, 0x49, 0x4d], 4);
        view.setUint16(8, 1005, false);
        view.setUint16(10, 0, false);
        view.setUint32(12, 16, false);
        view.setInt32(16, Math.round(dpi * 65536), false);
        view.setUint16(20, 1, false);
        view.setUint16(22, 1, false);
        view.setInt32(24, Math.round(dpi * 65536), false);
        view.setUint16(28, 1, false);
        view.setUint16(30, 1, false);

        return block;
    }

    private static pngChunk(type: string, data: Uint8Array): Uint8Array {
        const chunk = new Uint8Array(12 + data.length);
        const view = new DataView(chunk.buffer);

        view.setUint32(0, data.length, false);
        chunk.set(
            [...type].map((character) => character.charCodeAt(0)),
            4
        );
        chunk.set(data, 8);
        view.setUint32(8 + data.length, ByteUtilities.crc32(chunk.subarray(4, 8 + data.length)), false);

        return chunk;
    }
}
