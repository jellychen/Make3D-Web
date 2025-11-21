/* eslint-disable no-unused-vars */

import Curve3D from './curve-3d';
import isArray from "lodash/isArray";

/**
 * 临时对象
 */
const curve = new Curve3D;

/**
 * 收尾相连的曲线
 */
export default class Curve3DSegments {
    /**
     * 点
     */
    #points = [];

    /**
     * 获取
     */
    get points() {
        return this.#points;
    }

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
        return this.#points.length < 4 * 3;
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
            return Math.trunc((length - 3) / 9);
        }
    }

    /**
     * 
     * 移动
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns 
     */
    moveTo(x, y, z) {
        this.#points.length = 0;
        this.#points.push(x);
        this.#points.push(y);
        this.#points.push(z);
        return this;
    }

    /**
     * 
     * 添加贝塞尔曲线
     * 
     * @param {*} c0_x 
     * @param {*} c0_y 
     * @param {*} c0_z 
     * @param {*} c1_x 
     * @param {*} c1_y 
     * @param {*} c1_z 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns 
     */
    bezierTo(c0_x, c0_y, c0_z, c1_x, c1_y, c1_z, x, y, z) {
        if (this.#points.length == 0) {
            this.#points.push(0);
            this.#points.push(0);
            this.#points.push(0);
        }
        this.#points.push(c0_x);
        this.#points.push(c0_y);
        this.#points.push(c0_z);
        this.#points.push(c1_x);
        this.#points.push(c1_y);
        this.#points.push(c1_z);
        this.#points.push(x   );
        this.#points.push(y   );
        this.#points.push(z   );
        return this;
    }

    /**
     * 
     * 获取指定分段的曲线
     * 
     * @param {*} index 
     * @returns 
     */
    curveAt(index) {
        if (index >= this.count()) {
            throw new Error("out of range");
        }

        const a = this.#points;
        const i = index * 3 * 3;
        return new Curve3D(
            a[i     ],
            a[i + 1 ],
            a[i + 2 ],
            a[i + 3 ],
            a[i + 4 ],
            a[i + 5 ],
            a[i + 6 ],
            a[i + 7 ],
            a[i + 8 ],
            a[i + 9 ],
            a[i + 10],
            a[i + 11], 
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
        const i = index * 3 * 3;
        const p0 = curve.getPoint(0);
        p0.x = a[i];
        p0.y = a[i + 1];
        p0.z = a[i + 2];
        const p1 = curve.getPoint(1);
        p1.x = a[i + 3];
        p1.y = a[i + 4];
        p1.z = a[i + 5];
        const p2 = curve.getPoint(2);
        p2.x = a[i + 6];
        p2.y = a[i + 7];
        p2.z = a[i + 8];
        const p3 = curve.getPoint(3);
        p3.x = a[i + 9];
        p3.y = a[i + 10];
        p3.z = a[i + 11];
        return curve;
    }

    /**
     * 
     * 细分
     * 
     * @param {]} segments_count 
     * @param {*} arr 
     */
    subdivision(segments_count, arr) {
        if (segments_count < 0 || !isArray(arr)) {
            return;
        }

        const count = this.count();
        for (let i = 0; i < count; ++i) {
            this.curveAtTo(i, curve);
            if (i == count - 1) {
                curve.subdivision(segments_count, arr, true);
            } else {
                curve.subdivision(segments_count, arr, false);
            }
        }

        return arr;
    }
}
