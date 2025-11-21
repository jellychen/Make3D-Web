/* eslint-disable no-unused-vars */

import { Bezier  } from "bezier-js";
import { isArray } from "lodash";

/**
 * 
 */
export default class Curve3D {
    /**
     * 曲线
     */
    #bezier;

    /**
     * 
     * 构造函数
     * 
     * @param {*} x0 
     * @param {*} y0 
     * @param {*} z0 
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} z1 
     * @param {*} x2 
     * @param {*} y2 
     * @param {*} z2 
     * @param {*} x3 
     * @param {*} y3 
     * @param {*} z3 
     */
    constructor(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        if (x0 instanceof Bezier) {
            this.#bezier = x0;
        } else {
            this.#bezier = new Bezier(x0, y0, z0, 
                                      x1, y1, z1, 
                                      x2, y2, z2, 
                                      x3, y3, z3);
        }
    }

    /**
     * 
     * 指定时间
     * 
     * {x, y, z, t}
     * 
     * @param {*} t 
     * @returns 
     */
    get(t = 0.5) {
        return this.#bezier.get(t);
    }

    /**
     * 
     * 获取指定的点
     * 
     * {x, y, z}
     * 
     * @param {*} index 
     * @returns 
     */
    getPoint(index) {
        return this.#bezier.points[index];
    }

    /**
     * 
     * 获取起始点
     * 
     * @returns 
     */
    getStart() {
        return this.getPoint(0);
    }

    /**
     * 
     * 获取控制点 1
     * 
     * @returns 
     */
    getC0() {
        return this.getPoint(1);
    }

    /**
     * 
     * 获取控制点 2
     * 
     * @returns 
     */
    getC1() {
        return this.getPoint(2);
    }

    /**
     * 
     * 获取终结点
     * 
     * @returns 
     */
    getEnd() {
        return this.getPoint(3);
    }

    /**
     * 
     * 分拆
     * 
     * @param {*} t 
     * @returns 
     */
    split(t = 0.5) {
        const r = this.#bezier.split(t);
        return [new Curve3D(r.left), new Curve3D(r.right)];
    }

    /**
     * 
     * 找到距离这个点最近的点
     * 
     * @param {*} point 
     * @returns 
     */
    project(point) {
        return this.#bezier.project(point);
    }

    /**
     * 
     * 距离指定的最短距离
     * 
     * @param {*} point 
     * @returns 
     */
    projectDistance(point) {
        const pt = this.project(point);
        const x0 = point.x;
        const y0 = point.y;
        const x1 = pt.x;
        const y1 = pt.y;
        return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    }

    /**
     * 
     * 细分
     * 
     * @param {*} segments_count 
     * @param {*} arr 
     * @param {*} include_last 是否包含最后一个点
     * @returns 
     */
    subdivision(segments_count, arr, include_last = true) {
        if (segments_count < 0 || !isArray(arr)) {
            return;
        }

        const step = 1.0 / segments_count;
        for (let i = 0; i < segments_count; ++i) {
            const p = this.get(i * step);
            arr.push(p.x);
            arr.push(p.y);
            arr.push(p.z);
        }

        if (include_last) {
            const p = this.get(1);
            arr.push(p.x);
            arr.push(p.y);
            arr.push(p.z);
        }

        return arr;
    }
}
