/* eslint-disable no-undef */

import isUndefined from "lodash/isUndefined";
import Base        from "./base";

/**
 * 参数
 */
const COLOR_X = '#464646';
const COLOR_Y = '#3ecf8e';

/**
 * 用来绘制坐标轴
 */
export default class Coordinate extends Base {
    /**
     * 颜色
     */
    #color_x = COLOR_X;
    #color_y = COLOR_Y;

    /**
     * 
     * 构造函数
     * 
     * @param {*} color_x 
     * @param {*} color_y 
     */
    constructor(color_x, color_y) {
        super();
        if (!isUndefined(color_x)) {
            this.#color_x = color_x;
        }

        if (!isUndefined(color_y)) {
            this.#color_y = color_y;
        }
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColorX(color) {
        this.#color_x = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColorY(color) {
        this.#color_y = color;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        const dc = renderer.dc;

        // 绘制x轴
        dc.setLineDash([3 / this.scale, 3 / this.scale]);
        dc.strokeStyle = this.#color_x;
        dc.lineWidth = 1 / this.scale;
        dc.beginPath();
        dc.moveTo(-5000, 0);
        dc.lineTo(+5000, 0);
        dc.stroke();

        // 绘制y轴
        dc.setLineDash([3 / this.scale, 3 / this.scale]);
        dc.strokeStyle = this.#color_y;
        dc.lineWidth = 1 / this.scale;
        dc.beginPath();
        dc.moveTo(0, -5000);
        dc.lineTo(0, +5000);
        dc.stroke();

        // 绘制坐标中心的点
        dc.beginPath();
        dc.arc(0, 0, 2, 0, Math.PI * 2);
        dc.fillStyle = this.#color_x;
        dc.fill();
    }
}
