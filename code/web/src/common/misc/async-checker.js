/* eslint-disable no-unused-vars */

import isUndefined from "lodash/isUndefined";

/**
 * 异步检测
 */
export default class AsyncChecker {
    /**
     * 帧回调
     */
    #frame_handle;

    /**
     * 
     * 构造函数
     * 
     * @param {*} checker 
     * @param {*} callback 
     */
    constructor(checker, callback) {
        const runnable = () => {
            if (checker()) {
                callback();
                this.#frame_handle = undefined;
            } else {
                this.#frame_handle = requestAnimationFrame(runnable);
            }
        };
        this.#frame_handle = requestAnimationFrame(runnable);
    }

    /**
     * 终止
     */
    dispose() {
        if (!isUndefined(this.#frame_handle)) {
            cancelAnimationFrame(this.#frame_handle);
            this.#frame_handle = undefined;
        }
    }
}
