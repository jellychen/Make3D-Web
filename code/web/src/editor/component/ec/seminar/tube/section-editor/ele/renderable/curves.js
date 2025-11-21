/* eslint-disable no-undef */

import isInteger   from "lodash/isInteger";
import isUndefined from "lodash/isUndefined";
import Base        from "./base";

/**
 * 参数
 */
const COLOR = '#E8E8E8';

/**
 * 绘制曲线
 */
export default class Curves extends Base {
    /**
     * 颜色
     */
    #color = COLOR;

    /**
     * 宽度
     */
    #width = 1;

    /**
     * 曲线
     */
    #curves;
    #curves_index = undefined;

    /**
     * 获取
     */
    get curves() {
        return this.#curves;
    }

    /**
     * 获取
     */
    get curves_index() {
        return this.#curves_index;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} color 
     * @param {*} width 
     */
    constructor(color, width) {
        super();
        if (!isUndefined(color)) {
            this.#color = color;
        }

        if (!isUndefined(width)) {
            this.#width = parseFloat(width);
        }
    }


    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#color = color;
    }

    /**
     * 
     * 设置曲线
     * 
     * @param {*} curves 
     */
    setCurves(curves) {
        this.#curves = curves;
        this.#curves_index = undefined;
    }

    /**
     * 
     * 设置曲线, 全部曲线的中的一段
     * 
     * @param {*} curves 
     * @param {*} index 
     */
    setCurve(curves, index) {
        this.#curves = curves;
        this.#curves_index = index;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        if (!this.#curves) {
            return;
        }

        const dc = renderer.dc;
        dc.strokeStyle = this.#color;
        dc.lineWidth = this.#width / this.scale;
        dc.beginPath();

        if (isInteger(this.#curves_index)) {
            this.#curves.addSingleCurveToCanvas2dContext(dc, this.#curves_index);
        } else {
            this.#curves.addToCanvas2dContext(dc);
        }

        dc.stroke();
    }
}
