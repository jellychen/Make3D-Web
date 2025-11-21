/* eslint-disable no-unused-vars */

import PointContainer from "./points-container";

/**
 * 扩充
 */
Object.assign(PointContainer.prototype, {
    /**
     * 
     * 点选
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} tolerance 
     * @returns 
     */
    select(x, y, tolerance = 5) {
        const points = this.points;
        let changed = false;
        for (let i = 0; i < points.length; ++i) {
            const point = points[i];
            if (point.hittest(x, y, tolerance)) {
                if (!point.selected) {
                    point.select = true;
                    changed = true;
                }
            } else {
                if (point.select) {
                    point.select = false;
                    changed = true;
                }
            }
        }
        return changed;
    },

    /**
     * 
     * 框选
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     * @returns 
     */
    boxSelect(x, y, w, h) {
        const points = this.points;
        let changed = false;
        for (let i = 0; i < points.length; ++i) {
            const point = points[i];
            if (point.inBox(x, y, w, h)) {
                if (!point.selected) {
                    point.select = true;
                    changed = true;
                }
            } else {
                if (point.select) {
                    point.select = false;
                    changed = true;
                }
            }
        }
        return changed;
    }
});