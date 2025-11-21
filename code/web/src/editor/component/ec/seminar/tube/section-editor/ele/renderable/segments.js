/* eslint-disable no-undef */

import isUndefined from "lodash/isUndefined";
import isArray     from "lodash/isArray";
import Base        from "./base";


/**
 * 绘制线段
 */
export default class Segments extends Base {
    /**
     * 数组，4个元素一条线
     */
    #segments;

    /**
     * 颜色
     */
    #color;

    /**
     * 尺寸
     */
    #width = 1;

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
            this.setColor(color);
        }

        if (!isUndefined(width)) {
            this.setWidth(width);
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
     * 设置尺寸
     * 
     * @param {*} width 
     */
    setWidth(width) {
        this.#width = parseFloat(width);
    }

    /**
     * 
     * 设置点
     * 
     * @param {Array} segments 
     */
    setSegments(segments) {
        this.#segments = segments;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        if (!isArray(this.#segments)) {
            return;
        }

        const dc = renderer.dc;
        dc.setLineDash([2 / this.scale, 2 / this.scale]);
        dc.strokeStyle = this.#color;
        dc.lineWidth = this.#width / this.scale;
        dc.beginPath();

        // 添加点
        const count = this.#segments.length / 4;
        for (let i = 0; i < count; ++i) {
            const j  = 4 * i;
            const x0 = this.#segments[j];
            const y0 = this.#segments[j + 1];
            const x1 = this.#segments[j + 2];
            const y1 = this.#segments[j + 3];
            dc.moveTo(x0, y0);
            dc.lineTo(x1, y1);
        }

        //渲染
        dc.stroke();
    }
}
