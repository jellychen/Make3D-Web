/* eslint-disable no-undef */

import isUndefined from "lodash/isUndefined";
import Base        from "./base";

/**
 * 绘制框
 */
export default class SelectBox extends Base {
    /**
     * 参数
     */
    #x = 0;
    #y = 0;
    #w = 0;
    #h = 0;

    /**
     * 颜色
     */
    #color;

    /**
     * 
     * 构造函数
     * 
     * @param {*} color 
     */
    constructor(color) {
        super();
        if (!isUndefined(color)) {
            this.setColor(color);
        }
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {css color} color 
     */
    setColor(color) {
        this.#color = color;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    setLocation(x, y, w, h) {
        this.#x = x;
        this.#y = y;
        this.#w = w;
        this.#h = h;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        if (w == 0 || h == 0) {
            return;
        }

        const dc = renderer.dc;
        dc.setLineDash([4, 4]);
        dc.strokeStyle = this.#color;
        dc.lineWidth = 1 / this.scale;
        dc.beginPath();
        dc.rect(this.#x, this.#y, this.#w, this.#h);
        dc.stroke();
    }
}