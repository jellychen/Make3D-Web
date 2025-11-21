/* eslint-disable no-unused-vars */

import Curve from './curve';

/**
 * 容器
 */
export default class CurveContainer {
    /**
     * 数组
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
     * 添加
     * 
     * @param {*} curve 
     * @returns 
     */
    add(curve) {
        if (curve instanceof Curve) {
            this.#arr.push(curve);
            return true;
        }
    }

    /**
     * 
     * 移除
     * 
     * @param {*} curve 
     * @returns 
     */
    remove(curve) {
        const index = this.#arr.indexOf(curve);
        if (index < 0) {
            return false;
        }
        this.#arr.slice(index, 1);
        return true;
    }

    /**
     * 
     * 移除
     * 
     * @returns 
     */
    clear() {
        this.#arr.length = 0;
        return true;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} context 
     */
    draw(context) {
        for (const curve of this.#arr) {
            curve.draw(context);
        }
    }
}