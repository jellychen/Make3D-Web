/* eslint-disable no-unused-vars */

import cloneDeep from "lodash/cloneDeep";

/**
 * 记录曲线，三维三阶贝塞尔曲线
 */
export default class Path {
    /**
     * 记录点的位置，每3个元素一个点
     */
    points_ = [];

    /**
     * 是否是闭合的
     */
    close = false;

    /**
     * 
     * 数据拷贝
     * 
     * @returns 
     */
    clone() {
        const path = new Path();
        path.points_ = cloneDeep(this.points_);
        path.close = this.close;
        return path;
    }
}
