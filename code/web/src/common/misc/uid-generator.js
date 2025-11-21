/* eslint-disable no-unused-vars */

/**
 * 标记ID
 */
let __uid__ = 0;

/**
 * 
 * 唯一ID生成器
 * 
 * @returns 
 */
export default function() {
    return ++__uid__;
}
