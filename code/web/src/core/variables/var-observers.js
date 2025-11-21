/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 对一个变量的观察
 */
export default class VarObservers {
    /**
     * 回调池
     */
    #callbacks = [];

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加事件关注
     * 
     * @param {*} callback 
     * @returns 
     */
    on(callback) {
        if (!isFunction(callback)) {
            return false;
        }

        if (this.#callbacks.includes(callback)) {
            return false;
        } else {
            this.#callbacks.push(callback);
            return true;
        }
    }

    /**
     * 
     * 移除事件关注
     * 
     * @param {*} callback 
     * @returns 
     */
    off(callback) {
        if (!isFunction(callback)) {
            return false;
        }

        const index = this.#callbacks.indexOf(callback);
        if (index > -1) {
            this.#callbacks.splice(index, 1);
        }
        return true;
    }

    /**
     * 
     * 通知全部的关注者
     * 
     * @param {*} data 
     */
    notify(data) {
        for (const callback of this.#callbacks) {
            try {
                callback(data);
            } catch(e) {
                console.error(e);
            }
        }
    }
}
