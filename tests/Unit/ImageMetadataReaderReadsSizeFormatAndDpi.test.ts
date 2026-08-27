import assert from "node:assert/strict";
import { test } from "node:test";
import ImageMetadataReaderReadsSizeFormatAndDpi from "../Helpers/ImageMetadataReaderReadsSizeFormatAndDpi.js";

for (const entry of ImageMetadataReaderReadsSizeFormatAndDpi.CASES) {
    test(entry.name, () => {
        const metadata = ImageMetadataReaderReadsSizeFormatAndDpi.roundDpi(ImageMetadataReaderReadsSizeFormatAndDpi.read(entry.bytes));

        assert.deepEqual(metadata, entry.expected);
    });
}
