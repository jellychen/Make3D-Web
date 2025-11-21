/* eslint-disable no-unused-vars */

import isNull         from "lodash/isNull";
import isUndefined    from "lodash/isUndefined";
import BlobDownloader from "@common/misc/blob-downloader";
import Canvas2D       from "./canvas-2d-permanent";

/**
 * 
 * 下载
 * 
 * @param {*} texture 
 * @param {*} filename 
 * @returns 
 */
export default function Downloader(texture, filename="texture.png") {
    if (isUndefined(texture) || isNull(texture)) {
        return;
    }

    const image   = texture.image;
    const image_w = image.width;
    const image_h = image.height;
    if (!image || image_w <= 0 || image_h <= 0) {
        return;
    }

    Canvas2D.setSize(image_w, image_h);
    Canvas2D.clear();
    Canvas2D.drawImage(image, 0, 0, image_w, image_h);
    Canvas2D.toBlob(blob => BlobDownloader(blob, filename));
    return true;
}
