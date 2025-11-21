/* eslint-disable no-unused-vars */

import isArray        from 'lodash/isArray';
import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 找到所有选中的点
     * 
     * @param {*} arr 
     * @returns 
     */
    selectedPoints(arr) {
        if (!isArray(arr)) {
            arr = [];
        }

        for (const point of this.points) {
            if (point.selected) {
                arr.push(point.x);
                arr.push(point.y);
            }
        }

        return arr;
    },

    /**
     * 
     * 找到所有未选中的点
     * 
     * @param {*} arr 
     */
    unselectedPoints(arr) {
        if (!isArray(arr)) {
            arr = [];
        }

        for (const point of this.points) {
            if (!point.selected) {
                arr.push(point.x);
                arr.push(point.y);
            }
        }

        return arr;
    },

    /**
     * 
     * 找到全部的控制柄
     * 
     * @param {*} arr 
     * @returns 
     */
    handleSegments(arr) {
        if (!isArray(arr)) {
            arr = [];
        }

        const count = this.curvesCount();
        for (let i = 0; i < count; ++i) {
            const j = i * 3;
            const a = this.getPoint(j);
            const b = this.getPoint(j + 1);
            const c = this.getPoint(j + 2);
            const d = this.getPoint(j + 3);
            arr.push(a.x, a.y, b.x, b.y);
            arr.push(c.x, c.y, d.x, d.y);
        }

        return arr;
    },
});