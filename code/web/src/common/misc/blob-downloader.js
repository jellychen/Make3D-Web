/* eslint-disable no-unused-vars */

/**
 * 预先构建
 */
const link = document.createElement('a');

/**
 * 
 * 存储
 * 
 * @param {*} blob 
 * @param {*} name 
 */
export default function(blob, name = "file.blob") {
    const url     = URL.createObjectURL(blob);
    link.download = name;
    link.href     = url;
    link.click();
    URL.revokeObjectURL(url);
}