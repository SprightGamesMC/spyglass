import type { ImageDensity, ImageMetadata } from "../Types/LoaderTypes.js";

export default abstract class ImageMetadataReader {
    static readonly IMAGE_EXTENSIONS: readonly string[] = ["png", "tga", "jpg", "jpeg"];
    static readonly METERS_PER_INCH = 0.0254;
    private static readonly PNG_SIGNATURE: readonly number[] = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    private static readonly JPEG_SIGNATURE: readonly number[] = [0xff, 0xd8];
    private static readonly GIF_SIGNATURE: readonly number[] = [0x47, 0x49, 0x46];
    private static readonly PSD_SIGNATURE: readonly number[] = [0x38, 0x42, 0x50, 0x53];
    private static readonly PNG_HEADER_LENGTH = 33;
    private static readonly JPEG_HEADER_LENGTH = 4;
    private static readonly GIF_HEADER_LENGTH = 10;
    private static readonly PSD_HEADER_LENGTH = 26;
    private static readonly PNG_CHUNK_HEADER_LENGTH = 8;
    private static readonly PNG_CHUNK_TYPE_OFFSET = 4;
    private static readonly PNG_CHUNK_TYPE_LENGTH = 4;
    private static readonly PNG_CHUNK_CRC_LENGTH = 4;
    private static readonly PNG_HEADER_CHUNK_TYPE = "IHDR";
    private static readonly PNG_DATA_CHUNK_TYPE = "IDAT";
    private static readonly PNG_END_CHUNK_TYPE = "IEND";
    private static readonly PNG_PHYSICAL_CHUNK_TYPE = "pHYs";
    private static readonly PNG_TRANSPARENCY_CHUNK_TYPE = "tRNS";
    private static readonly PNG_HEADER_CHUNK_TYPE_OFFSET = 12;
    private static readonly PNG_WIDTH_OFFSET = 16;
    private static readonly PNG_HEIGHT_OFFSET = 20;
    private static readonly PNG_COLOR_TYPE_OFFSET = 25;
    private static readonly PNG_PHYSICAL_CHUNK_LENGTH = 9;
    private static readonly PNG_PHYSICAL_Y_OFFSET = 4;
    private static readonly PNG_PHYSICAL_UNIT_OFFSET = 8;
    private static readonly PNG_COLOR_TYPES_WITH_ALPHA: readonly number[] = [4, 6];
    private static readonly PNG_UNIT_METER = 1;
    private static readonly JPEG_START_OF_FRAME_MARKERS: readonly number[] = [
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
    ];
    private static readonly JPEG_MARKER_PREFIX = 0xff;
    private static readonly JPEG_MARKER_CODE_OFFSET = 1;
    private static readonly JPEG_SEGMENT_LENGTH_OFFSET = 2;
    private static readonly JPEG_SEGMENT_LENGTH_FIELD_LENGTH = 2;
    private static readonly JPEG_MARKER_HEADER_LENGTH = 4;
    private static readonly JPEG_SEGMENT_TAG_LENGTH = 4;
    private static readonly JPEG_FRAME_HEADER_LENGTH = 6;
    private static readonly JPEG_FRAME_HEIGHT_OFFSET = 1;
    private static readonly JPEG_FRAME_WIDTH_OFFSET = 3;
    private static readonly JPEG_FRAME_COMPONENTS_OFFSET = 5;
    private static readonly JPEG_COMPONENTS_WITH_ALPHA = 4;
    private static readonly JPEG_APP0 = 0xe0;
    private static readonly JPEG_APP1 = 0xe1;
    private static readonly JPEG_END_OF_IMAGE = 0xd9;
    private static readonly JPEG_START_OF_SCAN = 0xda;
    private static readonly JFIF_TAG = "JFIF";
    private static readonly JFIF_SEGMENT_LENGTH = 12;
    private static readonly JFIF_UNIT_OFFSET = 7;
    private static readonly JFIF_X_DENSITY_OFFSET = 8;
    private static readonly JFIF_Y_DENSITY_OFFSET = 10;
    private static readonly JFIF_UNIT_DOTS_PER_INCH = 1;
    private static readonly JFIF_UNIT_DOTS_PER_CENTIMETER = 2;
    private static readonly EXIF_TAG = "Exif";
    private static readonly EXIF_TAG_LENGTH = 6;
    private static readonly EXIF_TIFF_HEADER_LENGTH = 8;
    private static readonly EXIF_BYTE_ORDER_LENGTH = 2;
    private static readonly EXIF_LITTLE_ENDIAN_BYTE_ORDER = "II";
    private static readonly EXIF_DIRECTORY_OFFSET_FIELD_OFFSET = 4;
    private static readonly EXIF_ENTRY_COUNT_LENGTH = 2;
    private static readonly EXIF_ENTRY_LENGTH = 12;
    private static readonly EXIF_ENTRY_VALUE_OFFSET = 8;
    private static readonly EXIF_RATIONAL_LENGTH = 8;
    private static readonly EXIF_RATIONAL_DENOMINATOR_OFFSET = 4;
    private static readonly EXIF_X_RESOLUTION = 0x011a;
    private static readonly EXIF_Y_RESOLUTION = 0x011b;
    private static readonly EXIF_RESOLUTION_UNIT = 0x0128;
    private static readonly EXIF_UNIT_INCH = 2;
    private static readonly EXIF_UNIT_CENTIMETER = 3;
    private static readonly CENTIMETERS_PER_INCH = 2.54;
    private static readonly GIF_WIDTH_OFFSET = 6;
    private static readonly GIF_HEIGHT_OFFSET = 8;
    private static readonly PSD_VERSION_OFFSET = 4;
    private static readonly PSD_VERSIONS: readonly number[] = [1, 2];
    private static readonly PSD_CHANNELS_OFFSET = 12;
    private static readonly PSD_HEIGHT_OFFSET = 14;
    private static readonly PSD_WIDTH_OFFSET = 18;
    private static readonly PSD_CHANNELS_WITH_ALPHA = 4;
    private static readonly PSD_LENGTH_FIELD_LENGTH = 4;
    private static readonly PSD_RESOURCE_MINIMUM_LENGTH = 10;
    private static readonly PSD_RESOURCE_SIGNATURE = "8BIM";
    private static readonly PSD_RESOURCE_ID_OFFSET = 4;
    private static readonly PSD_RESOURCE_NAME_OFFSET = 6;
    private static readonly PSD_RESOURCE_NAME_LENGTH_FIELD_LENGTH = 1;
    private static readonly PSD_RESOURCE_ALIGNMENT = 2;
    private static readonly PSD_RESOLUTION_INFO_ID = 1005;
    private static readonly PSD_RESOLUTION_INFO_LENGTH = 16;
    private static readonly PSD_HORIZONTAL_UNIT_OFFSET = 4;
    private static readonly PSD_VERTICAL_RESOLUTION_OFFSET = 8;
    private static readonly PSD_VERTICAL_UNIT_OFFSET = 12;
    private static readonly PSD_FIXED_POINT_SCALE = 65536;
    private static readonly PSD_UNIT_PIXELS_PER_INCH = 1;
    private static readonly PSD_UNIT_PIXELS_PER_CENTIMETER = 2;
    private static readonly TGA_HEADER_LENGTH = 18;
    private static readonly TGA_IMAGE_TYPE_OFFSET = 2;
    private static readonly TGA_WIDTH_OFFSET = 12;
    private static readonly TGA_HEIGHT_OFFSET = 14;
    private static readonly TGA_PIXEL_DEPTH_OFFSET = 16;
    private static readonly TGA_IMAGE_TYPES: readonly number[] = [1, 2, 3, 9, 10, 11];
    private static readonly TGA_PIXEL_DEPTHS: readonly number[] = [8, 15, 16, 24, 32];
    private static readonly TGA_PIXEL_DEPTH_WITH_ALPHA = 32;

    static read(bytes: Uint8Array): ImageMetadata | undefined {
        if (ImageMetadataReader.hasSignature(bytes, ImageMetadataReader.PNG_SIGNATURE, ImageMetadataReader.PNG_HEADER_LENGTH)) {
            return ImageMetadataReader.readPng(bytes);
        }

        if (ImageMetadataReader.hasSignature(bytes, ImageMetadataReader.JPEG_SIGNATURE, ImageMetadataReader.JPEG_HEADER_LENGTH)) {
            return ImageMetadataReader.readJpeg(bytes);
        }

        if (ImageMetadataReader.hasSignature(bytes, ImageMetadataReader.GIF_SIGNATURE, ImageMetadataReader.GIF_HEADER_LENGTH)) {
            return ImageMetadataReader.readGif(bytes);
        }

        if (ImageMetadataReader.hasSignature(bytes, ImageMetadataReader.PSD_SIGNATURE, ImageMetadataReader.PSD_HEADER_LENGTH)) {
            return ImageMetadataReader.readPsd(bytes);
        }

        return ImageMetadataReader.readTga(bytes);
    }

    private static hasSignature(bytes: Uint8Array, signature: readonly number[], minimumLength: number): boolean {
        return bytes.length >= minimumLength && signature.every((value, index) => bytes[index] === value);
    }

    private static readPng(bytes: Uint8Array): ImageMetadata | undefined {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const firstChunkType = ImageMetadataReader.readAscii(
            bytes,
            ImageMetadataReader.PNG_HEADER_CHUNK_TYPE_OFFSET,
            ImageMetadataReader.PNG_CHUNK_TYPE_LENGTH
        );

        if (firstChunkType !== ImageMetadataReader.PNG_HEADER_CHUNK_TYPE) {
            return undefined;
        }

        const width = view.getUint32(ImageMetadataReader.PNG_WIDTH_OFFSET, false);
        const height = view.getUint32(ImageMetadataReader.PNG_HEIGHT_OFFSET, false);
        const colorType = bytes[ImageMetadataReader.PNG_COLOR_TYPE_OFFSET];
        const density = ImageMetadataReader.readPngDensity(bytes, view);

        return {
            format: "png",
            width,
            height,
            hasAlpha:
                ImageMetadataReader.PNG_COLOR_TYPES_WITH_ALPHA.includes(colorType) ||
                ImageMetadataReader.hasPngTransparencyChunk(bytes, view),
            horizontalDpi: density?.horizontal,
            verticalDpi: density?.vertical,
        };
    }

    private static readPngDensity(bytes: Uint8Array, view: DataView): ImageDensity | undefined {
        const data = ImageMetadataReader.findPngChunk(bytes, view, ImageMetadataReader.PNG_PHYSICAL_CHUNK_TYPE);

        if (data === undefined || data + ImageMetadataReader.PNG_PHYSICAL_CHUNK_LENGTH > bytes.length) {
            return undefined;
        }

        const x = view.getUint32(data, false);
        const y = view.getUint32(data + ImageMetadataReader.PNG_PHYSICAL_Y_OFFSET, false);
        const unit = bytes[data + ImageMetadataReader.PNG_PHYSICAL_UNIT_OFFSET];

        if (unit !== ImageMetadataReader.PNG_UNIT_METER) {
            return undefined;
        }

        return { horizontal: x * ImageMetadataReader.METERS_PER_INCH, vertical: y * ImageMetadataReader.METERS_PER_INCH };
    }

    private static hasPngTransparencyChunk(bytes: Uint8Array, view: DataView): boolean {
        return ImageMetadataReader.findPngChunk(bytes, view, ImageMetadataReader.PNG_TRANSPARENCY_CHUNK_TYPE) !== undefined;
    }

    private static findPngChunk(bytes: Uint8Array, view: DataView, wanted: string): number | undefined {
        let offset = ImageMetadataReader.PNG_SIGNATURE.length;

        while (offset + ImageMetadataReader.PNG_CHUNK_HEADER_LENGTH <= bytes.length) {
            const length = view.getUint32(offset, false);
            const type = ImageMetadataReader.readAscii(
                bytes,
                offset + ImageMetadataReader.PNG_CHUNK_TYPE_OFFSET,
                ImageMetadataReader.PNG_CHUNK_TYPE_LENGTH
            );

            if (type === wanted) {
                return offset + ImageMetadataReader.PNG_CHUNK_HEADER_LENGTH;
            }

            if (type === ImageMetadataReader.PNG_DATA_CHUNK_TYPE || type === ImageMetadataReader.PNG_END_CHUNK_TYPE) {
                return undefined;
            }

            offset += ImageMetadataReader.PNG_CHUNK_HEADER_LENGTH + ImageMetadataReader.PNG_CHUNK_CRC_LENGTH + length;
        }

        return undefined;
    }

    private static readJpeg(bytes: Uint8Array): ImageMetadata | undefined {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        let offset = ImageMetadataReader.JPEG_SIGNATURE.length;
        let width: number | undefined;
        let height: number | undefined;
        let density: ImageDensity | undefined;
        let components = 0;

        while (offset + ImageMetadataReader.JPEG_MARKER_HEADER_LENGTH <= bytes.length) {
            if (bytes[offset] !== ImageMetadataReader.JPEG_MARKER_PREFIX) {
                return undefined;
            }

            const marker = bytes[offset + ImageMetadataReader.JPEG_MARKER_CODE_OFFSET];

            if (marker === ImageMetadataReader.JPEG_END_OF_IMAGE || marker === ImageMetadataReader.JPEG_START_OF_SCAN) {
                break;
            }

            const length = view.getUint16(offset + ImageMetadataReader.JPEG_SEGMENT_LENGTH_OFFSET, false);
            const segmentStart = offset + ImageMetadataReader.JPEG_MARKER_HEADER_LENGTH;
            const segmentTag = ImageMetadataReader.readAscii(bytes, segmentStart, ImageMetadataReader.JPEG_SEGMENT_TAG_LENGTH);

            if (marker === ImageMetadataReader.JPEG_APP0 && segmentTag === ImageMetadataReader.JFIF_TAG) {
                density = ImageMetadataReader.readJfifDensity(bytes, view, segmentStart) ?? density;
            }

            if (marker === ImageMetadataReader.JPEG_APP1 && segmentTag === ImageMetadataReader.EXIF_TAG) {
                density =
                    ImageMetadataReader.readExifDensity(
                        bytes,
                        segmentStart + ImageMetadataReader.EXIF_TAG_LENGTH,
                        segmentStart + length - ImageMetadataReader.JPEG_SEGMENT_LENGTH_FIELD_LENGTH
                    ) ?? density;
            }

            if (
                ImageMetadataReader.JPEG_START_OF_FRAME_MARKERS.includes(marker) &&
                segmentStart + ImageMetadataReader.JPEG_FRAME_HEADER_LENGTH <= bytes.length
            ) {
                height = view.getUint16(segmentStart + ImageMetadataReader.JPEG_FRAME_HEIGHT_OFFSET, false);
                width = view.getUint16(segmentStart + ImageMetadataReader.JPEG_FRAME_WIDTH_OFFSET, false);
                components = bytes[segmentStart + ImageMetadataReader.JPEG_FRAME_COMPONENTS_OFFSET];
            }

            offset = segmentStart + length - ImageMetadataReader.JPEG_SEGMENT_LENGTH_FIELD_LENGTH;
        }

        if (width === undefined || height === undefined) {
            return undefined;
        }

        return {
            format: "jpeg",
            width,
            height,
            hasAlpha: components === ImageMetadataReader.JPEG_COMPONENTS_WITH_ALPHA,
            horizontalDpi: density?.horizontal,
            verticalDpi: density?.vertical,
        };
    }

    private static readJfifDensity(bytes: Uint8Array, view: DataView, start: number): ImageDensity | undefined {
        if (start + ImageMetadataReader.JFIF_SEGMENT_LENGTH > bytes.length) {
            return undefined;
        }

        const unit = bytes[start + ImageMetadataReader.JFIF_UNIT_OFFSET];
        const x = view.getUint16(start + ImageMetadataReader.JFIF_X_DENSITY_OFFSET, false);
        const y = view.getUint16(start + ImageMetadataReader.JFIF_Y_DENSITY_OFFSET, false);

        if (unit === ImageMetadataReader.JFIF_UNIT_DOTS_PER_INCH) {
            return { horizontal: x, vertical: y };
        }

        if (unit === ImageMetadataReader.JFIF_UNIT_DOTS_PER_CENTIMETER) {
            return { horizontal: x * ImageMetadataReader.CENTIMETERS_PER_INCH, vertical: y * ImageMetadataReader.CENTIMETERS_PER_INCH };
        }

        return undefined;
    }

    private static readExifDensity(bytes: Uint8Array, start: number, end: number): ImageDensity | undefined {
        if (start + ImageMetadataReader.EXIF_TIFF_HEADER_LENGTH > end || end > bytes.length) {
            return undefined;
        }

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const byteOrder = ImageMetadataReader.readAscii(bytes, start, ImageMetadataReader.EXIF_BYTE_ORDER_LENGTH);
        const littleEndian = byteOrder === ImageMetadataReader.EXIF_LITTLE_ENDIAN_BYTE_ORDER;
        const directoryOffset = start + view.getUint32(start + ImageMetadataReader.EXIF_DIRECTORY_OFFSET_FIELD_OFFSET, littleEndian);

        if (directoryOffset + ImageMetadataReader.EXIF_ENTRY_COUNT_LENGTH > end) {
            return undefined;
        }

        const entryCount = view.getUint16(directoryOffset, littleEndian);
        let x: number | undefined;
        let y: number | undefined;
        let unit = ImageMetadataReader.EXIF_UNIT_INCH;

        for (let index = 0; index < entryCount; index += 1) {
            const entry = directoryOffset + ImageMetadataReader.EXIF_ENTRY_COUNT_LENGTH + index * ImageMetadataReader.EXIF_ENTRY_LENGTH;

            if (entry + ImageMetadataReader.EXIF_ENTRY_LENGTH > end) {
                break;
            }

            const tag = view.getUint16(entry, littleEndian);
            const valueOffset = entry + ImageMetadataReader.EXIF_ENTRY_VALUE_OFFSET;

            if (tag === ImageMetadataReader.EXIF_RESOLUTION_UNIT) {
                unit = view.getUint16(valueOffset, littleEndian);
            }

            if (tag === ImageMetadataReader.EXIF_X_RESOLUTION) {
                x = ImageMetadataReader.readExifRational(view, start + view.getUint32(valueOffset, littleEndian), littleEndian, end);
            }

            if (tag === ImageMetadataReader.EXIF_Y_RESOLUTION) {
                y = ImageMetadataReader.readExifRational(view, start + view.getUint32(valueOffset, littleEndian), littleEndian, end);
            }
        }

        if (x === undefined || y === undefined) {
            return undefined;
        }

        if (unit === ImageMetadataReader.EXIF_UNIT_CENTIMETER) {
            return { horizontal: x * ImageMetadataReader.CENTIMETERS_PER_INCH, vertical: y * ImageMetadataReader.CENTIMETERS_PER_INCH };
        }

        return { horizontal: x, vertical: y };
    }

    private static readExifRational(view: DataView, offset: number, littleEndian: boolean, end: number): number | undefined {
        if (offset + ImageMetadataReader.EXIF_RATIONAL_LENGTH > end) {
            return undefined;
        }

        const numerator = view.getUint32(offset, littleEndian);
        const denominator = view.getUint32(offset + ImageMetadataReader.EXIF_RATIONAL_DENOMINATOR_OFFSET, littleEndian);

        return denominator === 0 ? undefined : numerator / denominator;
    }

    private static readGif(bytes: Uint8Array): ImageMetadata | undefined {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const width = view.getUint16(ImageMetadataReader.GIF_WIDTH_OFFSET, true);
        const height = view.getUint16(ImageMetadataReader.GIF_HEIGHT_OFFSET, true);

        return { format: "gif", width, height, hasAlpha: true };
    }

    private static readPsd(bytes: Uint8Array): ImageMetadata | undefined {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const version = view.getUint16(ImageMetadataReader.PSD_VERSION_OFFSET, false);

        if (!ImageMetadataReader.PSD_VERSIONS.includes(version)) {
            return undefined;
        }

        const channels = view.getUint16(ImageMetadataReader.PSD_CHANNELS_OFFSET, false);
        const height = view.getUint32(ImageMetadataReader.PSD_HEIGHT_OFFSET, false);
        const width = view.getUint32(ImageMetadataReader.PSD_WIDTH_OFFSET, false);
        const density = ImageMetadataReader.readPsdDensity(bytes, view);

        return {
            format: "psd",
            width,
            height,
            hasAlpha: channels >= ImageMetadataReader.PSD_CHANNELS_WITH_ALPHA,
            horizontalDpi: density?.horizontal,
            verticalDpi: density?.vertical,
        };
    }

    private static readPsdDensity(bytes: Uint8Array, view: DataView): ImageDensity | undefined {
        let offset = ImageMetadataReader.PSD_HEADER_LENGTH;

        if (offset + ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH > bytes.length) {
            return undefined;
        }

        const colorModeLength = view.getUint32(offset, false);

        offset += ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH + colorModeLength;

        if (offset + ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH > bytes.length) {
            return undefined;
        }

        const resourcesLength = view.getUint32(offset, false);

        offset += ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH;

        const end = Math.min(bytes.length, offset + resourcesLength);

        while (offset + ImageMetadataReader.PSD_RESOURCE_MINIMUM_LENGTH <= end) {
            const signature = ImageMetadataReader.readAscii(bytes, offset, ImageMetadataReader.PSD_RESOURCE_SIGNATURE.length);

            if (signature !== ImageMetadataReader.PSD_RESOURCE_SIGNATURE) {
                return undefined;
            }

            const resourceId = view.getUint16(offset + ImageMetadataReader.PSD_RESOURCE_ID_OFFSET, false);
            const nameLength = bytes[offset + ImageMetadataReader.PSD_RESOURCE_NAME_OFFSET];
            const nameFieldLength = ImageMetadataReader.PSD_RESOURCE_NAME_LENGTH_FIELD_LENGTH + nameLength;
            const paddedNameLength = nameFieldLength + (nameFieldLength % ImageMetadataReader.PSD_RESOURCE_ALIGNMENT);
            const sizeOffset = offset + ImageMetadataReader.PSD_RESOURCE_NAME_OFFSET + paddedNameLength;

            if (sizeOffset + ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH > end) {
                return undefined;
            }

            const dataLength = view.getUint32(sizeOffset, false);
            const dataOffset = sizeOffset + ImageMetadataReader.PSD_LENGTH_FIELD_LENGTH;

            if (
                resourceId === ImageMetadataReader.PSD_RESOLUTION_INFO_ID &&
                dataOffset + ImageMetadataReader.PSD_RESOLUTION_INFO_LENGTH <= end
            ) {
                return ImageMetadataReader.parsePsdResolution(view, dataOffset);
            }

            offset = dataOffset + dataLength + (dataLength % ImageMetadataReader.PSD_RESOURCE_ALIGNMENT);
        }

        return undefined;
    }

    private static parsePsdResolution(view: DataView, offset: number): ImageDensity | undefined {
        const horizontal = view.getInt32(offset, false) / ImageMetadataReader.PSD_FIXED_POINT_SCALE;
        const horizontalUnit = view.getUint16(offset + ImageMetadataReader.PSD_HORIZONTAL_UNIT_OFFSET, false);
        const vertical =
            view.getInt32(offset + ImageMetadataReader.PSD_VERTICAL_RESOLUTION_OFFSET, false) / ImageMetadataReader.PSD_FIXED_POINT_SCALE;
        const verticalUnit = view.getUint16(offset + ImageMetadataReader.PSD_VERTICAL_UNIT_OFFSET, false);
        const horizontalDpi = ImageMetadataReader.psdResolutionToDpi(horizontal, horizontalUnit);
        const verticalDpi = ImageMetadataReader.psdResolutionToDpi(vertical, verticalUnit);

        if (horizontalDpi === undefined || verticalDpi === undefined) {
            return undefined;
        }

        return { horizontal: horizontalDpi, vertical: verticalDpi };
    }

    private static psdResolutionToDpi(value: number, unit: number): number | undefined {
        if (unit === ImageMetadataReader.PSD_UNIT_PIXELS_PER_INCH) {
            return value;
        }

        if (unit === ImageMetadataReader.PSD_UNIT_PIXELS_PER_CENTIMETER) {
            return value * ImageMetadataReader.CENTIMETERS_PER_INCH;
        }

        return undefined;
    }

    private static readTga(bytes: Uint8Array): ImageMetadata | undefined {
        if (bytes.length < ImageMetadataReader.TGA_HEADER_LENGTH) {
            return undefined;
        }

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const imageType = bytes[ImageMetadataReader.TGA_IMAGE_TYPE_OFFSET];

        if (!ImageMetadataReader.TGA_IMAGE_TYPES.includes(imageType)) {
            return undefined;
        }

        const width = view.getUint16(ImageMetadataReader.TGA_WIDTH_OFFSET, true);
        const height = view.getUint16(ImageMetadataReader.TGA_HEIGHT_OFFSET, true);
        const pixelDepth = bytes[ImageMetadataReader.TGA_PIXEL_DEPTH_OFFSET];

        if (width === 0 || height === 0 || !ImageMetadataReader.TGA_PIXEL_DEPTHS.includes(pixelDepth)) {
            return undefined;
        }

        return { format: "tga", width, height, hasAlpha: pixelDepth === ImageMetadataReader.TGA_PIXEL_DEPTH_WITH_ALPHA };
    }

    private static readAscii(bytes: Uint8Array, offset: number, length: number): string {
        if (offset + length > bytes.length) {
            return "";
        }

        return String.fromCharCode(...bytes.subarray(offset, offset + length));
    }
}
