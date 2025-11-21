/* eslint-disable no-unused-vars */

/**
 * 
 * 读取格式
 * 
 * @param {*} canvas 
 * @returns 
 */
export default function Reader(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob)      => {
            const reader          = new FileReader();
            reader.onload         = () => {
                const arrayBuffer = reader.result;
                const uint8Array  = new Uint8Array(arrayBuffer);
                resolve(uint8Array);
            };
            reader.readAsArrayBuffer(blob);
        }, 'image/png');
    });
}
