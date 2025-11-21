/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';

/**
 * 延迟销毁
 */
export default class DeferDestory {
    /**
     * 回调池子
     */
    #callable_container = [];

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加延迟函数
     * 
     * @param {Function} callback 
     */
    add(callback) {
        if (isFunction(callback)) {
            this.#callable_container.push(callback);
        }
    }

    /**
     * 销毁
     */
    dismiss() {
        for (const callback of this.#callable_container) {
            try {
                callback();
            } catch(e) {
                console.error(e);
            }
        }
        this.#callable_container.length = 0;
    }
}
