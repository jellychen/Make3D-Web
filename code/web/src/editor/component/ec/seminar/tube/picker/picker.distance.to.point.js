/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Picker from './picker';

/**
 * 临时
 */
const VEC2_0 = new XThree.Vector2();

/**
 * 拾取点
 */
Object.assign(Picker.prototype, {
    /**
     * 
     * 返回屏幕空间的距离
     * 
     * @param {vec2} pointer_vec2 鼠标的指针
     * @param {vec3} vec3 世界坐标系
     * @returns 
     */
    distanceToPoint(pointer_vec2, vec3) {
        if (!this.isFrontOf(vec3)) {
            return Number.MAX_VALUE;
        }
        this.transformer.toScreen(vec3, VEC2_0);
        return pointer_vec2.distanceTo(VEC2_0);
    }
});
