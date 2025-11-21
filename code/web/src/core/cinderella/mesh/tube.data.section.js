/* eslint-disable no-unused-vars */

import cloneDeep from "lodash/cloneDeep";

/**
 * 截面 二维三阶贝塞尔曲线
 */
export default class Section {
    /**
     * 记录点的位置，每2个元素一个点
     */
    points_ = [];

    /**
     * 
     * 数据拷贝
     * 
     * @returns 
     */
    clone() {
        const section = new Section();
        section.points_ = cloneDeep(this.points_);
        return section;
    }
}
