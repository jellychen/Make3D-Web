/* eslint-disable no-unused-vars */

import Point from "./point";

/**
 * 点集合, 收尾相连，必须是一个封闭的图像
 */
export default class PointContainer {
    /**
     * 点集合
     */
    points = [];

    /**
     * 清理
     */
    clear() {
        this.points.length = 0;
    }

    /**
     * 
     * 曲线的数量
     * 
     * @returns 
     */
    curvesCount() {
        return Math.floor(this.points.length / 3);
    }

    /**
     * 
     * 区别索引
     * 
     * @param {*} index 
     * @returns 
     */
    normalizeIndex(index) {
        const length = this.points.length;
        return (index % length + length) % length;
    }

    /**
     * 
     * 获取点
     * 
     * @param {*} index 
     * @returns 
     */
    getPoint(index) {
        return this.points[this.normalizeIndex(index)];
    }

    /**
     * 
     * 移动到
     * 
     * @param {*} x 
     * @param {*} y 
     */
    moveTo(x, y) {
        if (this.points.length != 0) {
            throw new Error('moveTo error');
        }

        const pt = new Point();
        pt.x     = x;
        pt.y     = y;
        this.points.push(pt);
    }

    /**
     * 
     * 移动到
     * 
     * @param {*} c0_x 
     * @param {*} c0_y 
     * @param {*} c1_x 
     * @param {*} c1_y 
     * @param {*} x 
     * @param {*} y 
     */
    bezierTo(c0_x, c0_y, c1_x, c1_y, x, y) {
        if (this.points.length == 0) {
            throw new Error('bezierTo error');
        }

        const pt0      = new Point();
        pt0.x          = c0_x;
        pt0.y          = c0_y;
        pt0.controller = true;
        this.points.push(pt0);

        const pt1      = new Point();
        pt1.x          = c1_x;
        pt1.y          = c1_y;
        pt1.controller = true;
        this.points.push(pt1);

        const pt2      = new Point();
        pt2.x          = x;
        pt2.y          = y;
        this.points.push(pt2);
    }

    /**
     * 
     * 关闭
     * 
     * @param {*} c0_x 
     * @param {*} c0_y 
     * @param {*} c1_x 
     * @param {*} c1_y 
     */
    close(c0_x, c0_y, c1_x, c1_y) {
        if (this.points.length == 0) {
            throw new Error('bezierTo error');
        }

        const pt0      = new Point();
        pt0.x          = c0_x;
        pt0.y          = c0_y;
        pt0.controller = true;
        this.points.push(pt0);

        const pt1      = new Point();
        pt1.x          = c1_x;
        pt1.y          = c1_y;
        pt1.controller = true;
        this.points.push(pt1);
    }

    /**
     * 
     * 写入 Canvas2D Context
     * 
     * @param {*} context 
     */
    addToCanvas2dContext(context) {
        const count = this.curvesCount();
        for (let i = 0; i < count; ++i) {
            const j = i * 3;
            const a = this.getPoint(j);
            const b = this.getPoint(j + 1);
            const c = this.getPoint(j + 2);
            const d = this.getPoint(j + 3);
            context.moveTo(a.x, a.y);
            context.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
        }
    }

    /**
     * 
     * 写入 Canvas2D Context
     * 
     * @param {*} context 
     * @param {*} index 
     */
    addSingleCurveToCanvas2dContext(context, index) {
        const j = index * 3;
        const a = this.getPoint(j);
        const b = this.getPoint(j + 1);
        const c = this.getPoint(j + 2);
        const d = this.getPoint(j + 3);
        context.moveTo(a.x, a.y);
        context.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
    }

    /**
     * 
     * 转化成顶点数组
     * 
     * @returns 
     */
    toPointsArr() {
        const arr = [];
        for (const point of this.points) {
            arr.push(point.x);
            arr.push(point.y);
        }
        return arr;
    }
}
