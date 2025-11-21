/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 异步排他执行者
 */
export default class AsyncExclusivePerformer {
    /**
     * 最新的需要被执行者
     */
    #callback;

    /**
     * 
     * 延迟执行
     * 
     * @param {*} callback 
     */
    defer(callback) {
        this.#callback = callback;
    }

    /**
     * 
     * 调用
     * 
     * @param  {...any} args 
     */
    invoke(...args) {
        if (isFunction(this.#callback)) {
            try {
                this.#callback(...args);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 清理
     */
    clear() {
        this.#callback = undefined;
    }
}
