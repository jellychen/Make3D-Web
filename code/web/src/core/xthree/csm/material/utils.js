/* eslint-disable no-unused-vars */

/**
 * 功能函数
 */
export default {
    /**
     * 
     * 计算字符串的Hash
     * 
     * @param {*} str 
     * @returns 
     */
    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        }
        return String(hash >>> 0);
    },

    /**
     * 
     * 剔除注释
     * 
     * @param {*} str 
     * @returns 
     */
    stripComments(str) {
        return str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    },
}
