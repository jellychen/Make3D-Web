/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import Cache      from './cache';

/**
 * 
 * 加载指定的key的元素
 * 
 * @param {*} dao 
 * @param {*} key 
 * @param {*} callback 
 * @returns 
 */
export default function Load(dao, key, callback) {
    if (!(key in dao)) {
        return false;
    }

    // 修改标记
    const ref = dao[key];
    ref.cached = false;

    // 移除
    Cache.removeItem(key);

    // 从网络加载
    fetch(ref.url)
        .then(response => {
            if (!response.ok) {
                if (isFunction(callback)) {
                    callback(false);
                }
            } else {
                return response.blob();
            }
        })
        .then(blob => {
            if (isFunction(callback)) {
                callback(blob);
            }
            ref.cached = true;
            Cache.setItem(key, blob);
        });
}
