/* eslint-disable no-unused-vars */

/**
 * 一些基础的几何函数
 */
export default {
    /**
     * 
     * 判断两条线段是否相交
     * 
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} x2 
     * @param {*} y2 
     * @param {*} x3 
     * @param {*} y3 
     * @param {*} x4 
     * @param {*} y4 
     */
    judgeLineSegmentIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if (!(Math.min(x1, x2) <= Math.max(x3, x4) &&
              Math.min(y3, y4) <= Math.max(y1, y2) &&
              Math.min(x3, x4) <= Math.max(x1, x2) &&
              Math.min(y1, y2) <= Math.max(y3, y4))) {
            return false;
        }

        let u, v, w, z
        u = (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
        v = (x4 - x1) * (y2 - y1) - (x2 - x1) * (y4 - y1);
        w = (x1 - x3) * (y4 - y3) - (x4 - x3) * (y1 - y3);
        z = (x2 - x3) * (y4 - y3) - (x4 - x3) * (y2 - y3);
        return (u * v <= 0.00000001 && w * z <= 0.00000001);
    },
}
