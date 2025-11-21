/* eslint-disable no-unused-vars */

import isNull      from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import Canvas2D    from "./canvas-2d-permanent";

/**
 * 
 * threejs texture 转图片
 * 
 * @param {*} texture 
 * @param {*} w 
 * @param {*} h 
 * @param {*} mimeType 
 * @returns 
 */
export default function ToImageUrl(texture, w, h, mimeType = 'image/png') {
    if (isUndefined(texture) || isNull(texture)) {
        return '';
    }

    const canvas  = Canvas2D.canvas;
    const context = Canvas2D.context;
    const image   = texture.image;
    const image_w = image.width;
    const image_h = image.height;
    const p0      = w / h;
    const p1      = image_w / image_h;

    canvas.width  = w;
    canvas.height = h;

    try {
        if (p0 > p1) {
            const ih = image_h * w / image_w;
            const dy = (h - ih) * 0.5;
            context.clearRect(0, 0, w, h);
            context.drawImage(texture.image, 0, dy, w, ih);
        } else {
            const iw = image_w * h / image_h;
            const dx = (w - iw) * 0.5;
            context.clearRect(0, 0, w, h);
            context.drawImage(texture.image, dx, 0, iw, h);
        }
    } catch(e) {
        console.error(e);
    }

    return canvas.toDataURL(mimeType); // 可以是 'image/jpeg'
}
