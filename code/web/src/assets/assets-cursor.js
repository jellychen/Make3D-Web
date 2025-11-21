/* eslint-disable no-undef */

const context_cursor = require.context('@assets/cursor', true, /\.png$/); // png

/**
 * 
 * 根据文件名获取鼠标样式
 * 
 * @param {String} file_name 
 */
export default function getCursorImage(file_name) {
    try {
        return context_cursor(`./cursor-${file_name}.png`);
    } catch(e) {
        console.error(e);
        return null;
    }
}
