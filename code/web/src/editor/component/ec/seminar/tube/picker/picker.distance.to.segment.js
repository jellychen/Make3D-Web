/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Picker from './picker';

/**
 * 临时变量
 */
const VEC2_0 = new XThree.Vector2();
const VEC3_0 = new XThree.Vector3();

/**
 * 拾取段
 */
Object.assign(Picker.prototype, {
    /**
     * 
     * 返回屏幕空间的距离
     * 
     * @param {vec2} pointer_vec2 
     * @param {vec3} a 线段的点
     * @param {vec3} b 线段的点
     * @returns 
     */
    distanceToSegment(pointer_vec2, a, b) {
        const ray = this.ray;
        ray.distanceSqToSegment(a, b, undefined, VEC3_0);
        return this.distanceToPoint(VEC3_0);
    }
});
