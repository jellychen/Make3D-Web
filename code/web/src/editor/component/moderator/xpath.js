/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 获取
 */
export default class XPath {
    /**
     * 根元素
     */
    #root;

    /**
     * 当前的模块
     */
    #current_module;

    /**
     * 获取当前的模块
     */
    get current() {
        return this.#current_module;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} root 
     */
    constructor(root) {
        this.#root = root;
        this.#current_module = root;
    }

    /**
     * 
     * 重置
     * 
     * @returns 
     */
    reset() {
        this.#current_module = this.#root;
        return this;
    }

    /**
     * 
     * 获取模块
     * 
     * @param {*} name 
     * @returns 
     */
    module(name) {
        if (this.#current_module) {
            if (isFunction(this.#current_module.getModule)) {
                this.#current_module = this.#current_module.getModule(name);
            } else {
                this.#current_module = undefined;
            }
        }
        return this;
    }
}