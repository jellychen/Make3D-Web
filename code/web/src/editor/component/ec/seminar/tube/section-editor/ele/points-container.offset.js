/* eslint-disable no-unused-vars */

import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 移动一个点
     * 
     * @param {*} index 
     * @param {*} x 
     * @param {*} y 
     */
    offsetPoint(index, x, y) {
        const point = this.getPoint(index);
        point.x += x;
        point.y += y;
        return true;
    },

    /**
     * 
     * 移动一个曲线
     * 
     * @param {*} index 
     * @param {*} x 
     * @param {*} y 
     */
    offsetCurve(index, x, y) {
        const i = index * 3;

        if (i - 1 >= 0) {
            this.offsetPoint(i - 1, x, y);
        }

        if (i + 4 < this.points.length) {
            this.offsetPoint(i + 4, x, y);
        }

        for (let j = 0; j < 4; ++j) {
            this.offsetPoint(i + j, x, y);
        }
        return true;
    },
});