/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';

/**
 * 从贝塞尔曲线中提取控制柄
 */
export default class ControlSegments {
    /**
     * 
     * 获取控制柄
     * 
     * @param {*} segments 
     * @param {*} arr 
     * @returns 
     */
    static controls(segments, arr = undefined) {
        if (!segments) {
            return;
        }

        if (!isArray(arr)) {
            arr = [];
        }

        const curves_count = segments.count();
        if (curves_count == 0) {
            return arr;
        }

        const points = segments.points;
        for (let i = 0; i < curves_count; ++i) {
            const offset = i * 3 * 3;
            arr.push(points[offset]);
            arr.push(points[offset + 1]);
            arr.push(points[offset + 2]);
            arr.push(points[offset + 3]);
            arr.push(points[offset + 4]);
            arr.push(points[offset + 5]);

            arr.push(points[offset + 6]);
            arr.push(points[offset + 7]);
            arr.push(points[offset + 8]);
            arr.push(points[offset + 9]);
            arr.push(points[offset + 10]);
            arr.push(points[offset + 11]);
        }
        
        return arr;
    }
}
