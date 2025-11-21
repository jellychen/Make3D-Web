/* eslint-disable no-unused-vars */

import clone   from "lodash/clone";
import isArray from "lodash/isArray";

/**
 * 用来监听数据变化
 */
export default class ObjectsArrMonitor {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * 数据
     */
    #objects = [];

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        this.#coordinator = coordinator;
        this.#host = host;
    }

    /**
     * 
     * 设置初始化
     * 
     * @param {*} objects 
     */
    resetObjectes(objects) {
        if (isArray(objects)) {
            this.#objects = clone(objects);
        }
    }

    /**
     * 
     * 检测
     * 
     * @param {*} objects 
     */
    check(objects) {
        if (!isArray(objects)) {
            objects = [];
        }

        // 判断是不是一样
        const len_0 = this.#objects.length;
        const len_1 =       objects.length;
        let is_same = len_0 == len_1;
        if (is_same) {
            for (let i = 0; i < len_1; ++i) {
                if (this.#objects[i] != objects[i]) {
                    is_same = false;
                    break;
                }
            }

            if (is_same) {
                return;
            }
        }

        // 保留
        this.#host.historical_recorder.resetReceptacleObjects(this.#objects);
        this.#objects = clone(objects);
    }
}
