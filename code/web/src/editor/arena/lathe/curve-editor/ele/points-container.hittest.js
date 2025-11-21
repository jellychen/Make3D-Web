/* eslint-disable no-unused-vars */

import Curve          from '@core/curves/curve-2d';
import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 是否命中点
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} tolerance 
     * @returns 
     */
    hittest(x, y, tolerance = 5) {
        let offset = 0;
        for (const point of this.points) {
            if (point.hittest(x, y, tolerance)) {
                return offset;
            }
            ++offset;
        }
    },

    /**
     * 
     * 拾取曲线
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} tolerance 
     */
    hittestCurve(x, y, tolerance = 4) {
        const count = this.curvesCount();
        const curve = new Curve();
        let index = undefined;
        for (let i = 0; i < count; ++i) {
            this.getCurve(i, curve);
            const distance = curve.projectDistance({x, y});
            if (distance <= tolerance) {
                index = i;
                break;
            }
        }
        return index;
    },
});