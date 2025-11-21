/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 单例
 */
let singleton = null;

/**
 * 设置参数栈
 */
export default class Stack {
    /**
     * 栈
     */
    #arr = [];

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 获取单例
     * 
     * @returns 
     */
    static Default() {
        if (!singleton) {
            singleton = new Stack();
        }
        return singleton;
    }

    /**
     * 
     * 
     * 
     * @param {*} conf_snapshot 
     */
    save(conf_snapshot) {
        this.#arr.push(conf_snapshot);
    }

    /**
     * 
     * 存储
     * 
     * @returns 
     */
    restore() {
        if (this.#arr.length == 0) {
            return false;
        } else {
            this.#arr.pop().makeCurrent();
            return true;
        }
    }
};
