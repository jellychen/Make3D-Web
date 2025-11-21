/* eslint-disable no-unused-vars */

import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 取消全部的选择
     * 
     * @returns 
     */
    unselected() {
        let changed = false;
        for (const point of this.points) {
            if (point.selected) {
                changed = true;
                point.selected = false;
            }
        }
        return changed;
    } 
});