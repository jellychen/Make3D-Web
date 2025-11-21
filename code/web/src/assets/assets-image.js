/* eslint-disable no-undef */

const context_image_icons = require.context('@assets/image-icons',      true, /\.(png|jpg|jpeg)$/);      // 图片图标
const context_images      = require.context('@assets/images',           true, /\.(png|jpg|jpeg)$/);      // 图片素材

/**
 * 
 * 根据文件名获取图片
 * 
 * @param {String} file_name 
 */
export default function getImage(file_name) {
    try {
        return context_images(`./${file_name}`);
    } catch(e) {
        return null;
    }
}
