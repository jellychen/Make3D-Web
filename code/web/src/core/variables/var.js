/* eslint-disable no-unused-vars */

import VarObservers from "./var-observers";

/**
 * 代表一个变量
 */
export default class Var {
    /**
     * data
     */
    #data;

    /**
     * 代理
     */
    #proxy;

    /**
     * 观察者
     */
    #observers = new VarObservers();

    /**
     * 获取
     */
    get data() {
        return this.#proxy;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} data 
     */
    constructor(data = {}) {
        const that = this;
        this.#data = data || {};
        this.#proxy = new Proxy(this.#data, {
            set(obj, prop, value) {
                if (obj[prop] != value) {
                    obj[prop] = value;
                    that.#observers.notify(that.#data);
                }
                return true;
            }
        });
    }

    /**
     * 
     * 观察
     * 
     * @param {*} callback 
     * @returns 
     */
    observe(callback) {
        return this.#observers.on(callback);
    }

    /**
     * 
     * 取消观察
     * 
     * @param {*} callback 
     * @returns 
     */
    unobserve(callback) {
        return this.#observers.off(callback);
    }
}
