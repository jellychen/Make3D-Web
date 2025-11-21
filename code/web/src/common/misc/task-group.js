/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction'

/**
 * 一组任务
 */
export default class TaskGroup {
    /**
     * 状态回调
     */
    #on_success;
    #on_fail;

    /**
     * 任务数量
     */
    #task_count = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {Function} on_success 
     * @param {Function} on_fail 
     */
    constructor(on_success, on_fail) {
        this.#on_success = on_success;
        this.#on_fail    = on_fail;
    }

    /**
     * 新的任务
     */
    newTask() {
        this.#task_count++;
        return {
            /**
             * 
             * 成功函数
             * 
             * @returns 
             */
            success: () => {
                this.#task_count--;
                if (0 != this.#task_count) {
                    return;
                }

                if (isFunction(this.#on_success)) {
                    this.#on_success();
                }
            },

            /**
             * 
             * 失败函数
             * 
             * @param {*} info 
             */
            fail: (info) => {
                if (isFunction(this.#on_fail)) {
                    this.#on_fail(info);
                }
            }
        }
    }
}
