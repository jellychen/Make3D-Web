/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Context
 */
export default class PrepareContext {
    /**
     * 构造函数
     */
    constructor() {
        this.resolution_w = 1;
        this.resolution_h = 1;
        this.random       = Math.random() * 1000000;
        this.time         = performance.now();
    }

    /**
     * 
     * 更新分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    updateResolution(width, height) {
        this.resolution_w = width;
        this.resolution_h = height;
    }

    /**
     * 更新时间
     */
    updateTime() {
        this.time = performance.now();
    }

    /**
     * 更新随机数
     */
    updateRandom() {
        this.random = Math.random() * 1000000;
    }
}
