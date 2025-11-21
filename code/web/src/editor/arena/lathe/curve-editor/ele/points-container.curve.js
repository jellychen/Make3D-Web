/* eslint-disable no-unused-vars */

import isUndefined    from 'lodash/isUndefined';
import Curve          from '@core/curves/curve-2d';
import Point          from "./point";
import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 获取指定索引的曲线
     * 
     * @param {*} index 
     * @param {*} curve 
     * @returns 
     */
    getCurve(index, curve) {
        if (isUndefined(curve)) {
            curve = new Curve();
        }

        const i  = index * 3;
        const a0 = this.getPoint(i);
        const b0 = this.getPoint(i + 1);
        const c0 = this.getPoint(i + 2);
        const d0 = this.getPoint(i + 3);
        const a1 = curve.getPoint(0);
        const b1 = curve.getPoint(1);
        const c1 = curve.getPoint(2);
        const d1 = curve.getPoint(3);
        a1.x = a0.x; a1.y = a0.y;
        b1.x = b0.x; b1.y = b0.y;
        c1.x = c0.x; c1.y = c0.y;
        d1.x = d0.x; d1.y = d0.y;

        return curve;
    },

    /**
     * 
     * 指定的曲线，中间拆分
     * 
     * @param {*} index 
     */
    curveCenterSubdivision(index) {
        const curve = this.getCurve(index);
        const cs    = curve.split(0.5);
        const c0    = cs[0];
        const c1    = cs[1];

        // 首先修改
        const p0    = c0.getStart();
        const p1    = c0.getC0();
        const p2    = c0.getC1();
        const p3    = c0.getEnd();
        const p4    = c1.getC0();
        const p5    = c1.getC1();
        const p6    = c1.getEnd();

        let offset = index * 3;
        this.points[offset    ] = new Point(p0.x, p0.y, false);
        this.points[offset + 1] = new Point(p1.x, p1.y, true );
        this.points[offset + 2] = new Point(p2.x, p2.y, true );
        this.points[offset + 3] = new Point(p3.x, p3.y, false);
        this.points.splice(
            offset + 4,
            0,
            new Point(p4.x, p4.y, true ),
            new Point(p5.x, p5.y, true ),
            new Point(p6.x, p6.y, false));
    },

    /**
     * 
     * 删除指定的曲线
     * 
     * @param {*} index 
     */
    deleteCurve(index) {
        if (index == this.curvesCount() == 1) {
            this.points.splice(index * 3, 4);
        } else {
            this.points.splice(index * 3, 3);
        }
    },
});
