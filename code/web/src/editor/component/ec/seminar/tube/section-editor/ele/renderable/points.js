/* eslint-disable no-undef */

import isUndefined from "lodash/isUndefined";
import isArray     from "lodash/isArray";
import Base        from "./base";

/**
 * 绘制点
 */
export default class Points extends Base {
    /**
     * 数组，2个元素一个位置
     */
    #points;

    /**
     * 颜色
     */
    #color;

    /**
     * 尺寸
     */
    #size = 2;

    /**
     * 
     * 构造函数
     * 
     * @param {*} color 
     * @param {*} size 
     */
    constructor(color, size) {
        super();
        if (!isUndefined(color)) {
            this.setColor(color);
        }

        if (!isUndefined(size)) {
            this.setSize(size);
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
     * @param {*} size 
     */
    setSize(size) {
        this.#size = parseFloat(size);
    }

    /**
     * 
     * 设置点
     * 
     * @param {Array} points 
     */
    setPoints(points) {
        this.#points = points;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        if (!isArray(this.#points)) {
            return;
        }

        const dc = renderer.dc;
        dc.fillStyle = this.#color;
        dc.strokeStyle = '#FFF';
        dc.lineWidth = 1 /this.scale; 
        dc.beginPath();

        // 添加点
        const count = this.#points.length / 2;
        const pi_2 = Math.PI * 2;
        for (let i = 0; i < count; ++i) {
            const j = 2 * i;
            const x = this.#points[j];
            const y = this.#points[j + 1];
            const r = this.#size / this.scale;
            dc.moveTo(x + r, y);
            dc.arc(x, y, r, 0, pi_2);
        }

        // 渲染
        dc.fill();
        dc.stroke();
    }
}
