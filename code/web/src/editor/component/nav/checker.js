/* eslint-disable no-unused-vars */

import Checklist from './checklist';

/**
 * 用来检测模式是不是符合
 */
export default class Checker {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 
     * 检测
     * 
     * @param {string} token 
     */
    check(token) {
        return Checklist.Check(this.#coordinator, token);
    }
}
