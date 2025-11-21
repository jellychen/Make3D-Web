/* eslint-disable no-undef */

const context_hdrs = require.context('@assets/hdr', true, /\.hdr$/); // hdr

/**
 * 
 * 根据文件名获取HDR
 * 
 * @param {String} file_name 
 */
export default function getHdrImage(file_name) {
    try {
        return context_hdrs(`./${file_name}`).default;
    } catch(e) {
        console.error(e);
        return null;
    }
}
