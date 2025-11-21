/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';

/**
 * 通知
 */
export default class Caster {
    /**
     * 监听者
     */
    #listeners = [];

    /**
     * 
     * 添加
     * 
     * @param {*} listener 
     * @returns 
     */
    add(listener) {
        if (!isFunction(listener)) {
            return;
        } else {
            if (-1 == this.#listeners.indexOf(listener)) {
                this.#listeners.push(listener);
            }
        }
    }

    /**
     * 
     * 移除
     * 
     * @param {*} listener 
     * @returns 
     */
    del(listener) {
        if (!isFunction(listener)) {
            return;
        } else {
            const index = this.#listeners.indexOf(listener);
            if (index >= 0) {
                this.#listeners.splice(index, 1);
            }
        }
    }

    /**
     * 
     * 通知每一个
     * 
     * @param  {...any} args 
     */
    notify(...args) {
        for (const callback of this.#listeners) {
            callback(...args);
        }
    }
}