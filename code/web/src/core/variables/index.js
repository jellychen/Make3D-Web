/* eslint-disable no-unused-vars */

import Var from "./var";

/**
 * 一组变量
 */
export default class Variables {
    /**
     * 池子
     */
    #container = new Set();

    /**
     * 构造
     */
    constructor() {
        ;
    }

    /**
     * 
     * 判断值是不是存在
     * 
     * @param {*} name 
     * @returns 
     */
    has(name) {
        return this.#container.has(name);
    }

    /**
     * 
     * 设置一个值
     * 
     * @param {*} name 
     * @param {*} data 
     * @returns 
     */
    set(name, data) {
        if (this.#container.has(name)) {
            return false;
        }
        const _var = new Var(data);
        this.#container.set(name, _var);
        return _var;
    }

    /**
     * 
     * 获取
     * 
     * @param {*} name 
     * @returns 
     */
    get(name) {
        return this.#container.get(name);
    }

    /**
     * 
     * 删除
     * 
     * @param {*} name 
     */
    delete(name) {
        this.#container.delete(name);
    }

    /**
     * 删除
     */
    clear() {
        this.#container.clear();
    }
}
