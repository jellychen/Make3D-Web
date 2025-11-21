/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import isFunction from 'lodash/isFunction';

/**
 * 过滤器
 */
export default class Filter {
    /**
     * 传播者
     */
    #caster;

    /**
     * 
     * 事件
     * 
     * @param  {...any} args 
     * @returns 
     */
    #callback = (...args) => this.#onCallback(...args);

    /**
     * 过滤
     */
    #set = new Set();

    /**
     * 接收到
     */
    onrecv;

    /**
     * 
     * 构造函数
     * 
     * @param {*} caster 
     * @param {*} setup 
     */
    constructor(caster, setup = false) {
        this.#caster = caster;
        if (setup) {
            this.setup();
        }
    }

    /**
     * 安装
     */
    setup() {
        this.#caster.add(this.#callback);
    }

    /**
     * 
     * 添加过滤
     * 
     * @param {*} type 
     */
    add(type) {
        if (isString(type)) {
            this.#set.add(type);
        }
    }

    /**
     * 
     * 移除过滤
     * 
     * @param {*} type 
     */
    del(type) {
        this.#set.delete(type);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#caster.del(this.#callback);
    }

    /**
     * 
     * 事件函数
     * 
     * @param {*} type 
     * @param  {...any} args 
     */
    #onCallback(type, ...args) {
        if (isFunction(this.onrecv)) {
            if (this.#set.has(type)) {
                this.onrecv(type, ...args);
            }
        }
    }
}
