/* eslint-disable no-unused-vars */

import isNull      from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import Canvas2D    from "./canvas-2d-permanent";

/**
 * 
 * 获取数据
 * 
 * @param {*} texture 
 * @param {*} mimeType 
 * @param {*} flip_y 
 * @returns 
 */
export default async function ToArrayBuffer(texture, mimeType = 'image/png', flip_y = false) {
    if (isUndefined(texture) || isNull(texture)) {
        return null;
    }

    const image   = texture.image;
    const image_w = image.width;
    const image_h = image.height;
    if (!image || image_w <= 0 || image_h <= 0) {
        return null;
    }

    if (flip_y) {
        Canvas2D.setSize(image_w, image_h);
        Canvas2D.clear();
        Canvas2D.save();
        Canvas2D.flipY();
        Canvas2D.drawImage(image, 0, 0, image_w, image_h);
        Canvas2D.restore();
    } else {
        Canvas2D.setSize(image_w, image_h);
        Canvas2D.clear();
        Canvas2D.drawImage(image, 0, 0, image_w, image_h);
    }

    return new Promise((resolve) => Canvas2D.toBlob(blob => {
        blob.arrayBuffer().then(resolve);
    }, mimeType));
}