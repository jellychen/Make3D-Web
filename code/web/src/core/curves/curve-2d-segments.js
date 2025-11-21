/* eslint-disable no-unused-vars */

import Curve from './curve-2d';

/**
 * 收尾相连的曲线
 */
export default class CurveSegments {
    /**
     * 点
     */
    #points = [];

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.#points.length < 4 * 2;
    }

    /**
     * 
     * 获取曲线的分段的数量
     * 
     * @returns 
     */
    count() {
        const length = this.#points.length;
        if (length < 4) {
            return 0;
        } else {
            return Math.trunc((length - 2) / 6);
        }
    }

    /**
     * 
     * 构造
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    moveTo(x, y) {
        this.#points.length = 0;
        this.#points.push(x);
        this.#points.push(y);
        return this;
    }

    /**
     * 
     * 添加贝塞尔曲线
     * 
     * @param {*} c0_x 
     * @param {*} c0_y 
     * @param {*} c1_x 
     * @param {*} c1_y 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    bezierTo(c0_x, c0_y, c1_x, c1_y, x, y) {
        if (this.#points.length == 0) {
            this.#points.push(0);
            this.#points.push(0);
        }
        this.#points.push(c0_x);
        this.#points.push(c0_y);
        this.#points.push(c1_x);
        this.#points.push(c1_y);
        this.#points.push(x   );
        this.#points.push(y   );
        return this;
    }

    /**
     * 
     * 获取指定分段的曲线
     * 
     * @param {*} index 
     */
    curveAt(index) {
        if (index >= this.count()) {
            throw new Error("out of range");
        }

        const a = this.#points;
        const i = index * 3 * 2;
        return new Curve(
            a[i],
            a[i + 1],
            a[i + 2],
            a[i + 3],
            a[i + 4],
            a[i + 5],
            a[i + 6],
            a[i + 7]
        );
    }

    /**
     * 
     * 获取指定分段的曲线
     * 
     * @param {*} index 
     * @param {*} curve 
     * @returns 
     */
    curveAtTo(index, curve) {
        if (index >= this.count()) {
            throw new Error("out of range");
        }
        const a = this.#points;
        const i = index * 3 * 2;
        const p0 = curve.getPoint(0);
        p0.x = a[i];
        p0.y = a[i + 1];
        const p1 = curve.getPoint(1);
        p1.x = a[i + 2];
        p1.y = a[i + 3];
        const p2 = curve.getPoint(2);
        p2.x = a[i + 4];
        p2.y = a[i + 5];
        const p3 = curve.getPoint(3);
        p3.x = a[i + 6];
        p3.y = a[i + 7];
        return curve;
    }
}
