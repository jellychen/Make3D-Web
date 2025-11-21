/* eslint-disable no-undef */

const context_lotties = require.context('@assets/lotties', true, /\.json$/); // 动画

/**
 * 
 * 根据文件名获取动画
 * 
 * @param {String} file_name 
 */
export default function getLottieAnimation(file_name) {
    try {
        return context_lotties(`./${file_name}`);
    } catch(e) {
        console.error(e);
        return null;
    }
}