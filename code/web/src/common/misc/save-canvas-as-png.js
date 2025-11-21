/* eslint-disable no-unused-vars */

import { changeDpiDataUrl } from 'changedpi';

/**
 * 预先构建
 */
const link = document.createElement('a');

/**
 * 
 * 保存Canvas的内容作为PNG
 * 
 * @param {*} canvas 
 * @param {string} name 
 */
export default function SaveCanvasAsPng(canvas, name = "image.png") {
    const dpi     = canvas.width / canvas.clientWidth * 72;
    link.download = name;
    link.href     = changeDpiDataUrl(canvas.toDataURL("image/png"), dpi);
    link.click();
}
