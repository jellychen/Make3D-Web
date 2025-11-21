/* eslint-disable no-unused-vars */

import isString        from 'lodash/isString';
import EventDispatcher from './event-dispatcher';

/**
 * 用来监听按键按下两次
 */
export default class KeyboardDoublePress extends EventDispatcher {
    /**
     * 上一个按键
     */
    #key;

    /**
     * 上一个按键的时间
     */
    #key_time = 0;

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 检测是不是在 200ms
     * 
     * @param {string} key 
     */
    check(key) {
        if (!isString(key)) {
            return;
        }

        const current = performance.now();
        if (this.#key === key && current - this.#key_time < 500) {
            this.dispatch('double-press', 
                { 
                    key : this.#key
                });
            this.#key = undefined;
        } else {
            this.#key = key;
            this.#key_time = current;
        }
    }
}
