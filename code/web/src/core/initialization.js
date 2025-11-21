/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';

/**
 * 
 * 用来初始化 Core 下面的模块
 * 
 * @param {Function} on_success 
 * @param {Function} on_fail 
 */
export default function(on_success, on_fail) {
    if (isFunction(on_success)) {
        on_success();
    }
}
