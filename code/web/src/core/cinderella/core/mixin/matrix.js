/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 临时变量
 */
const position   = new XThree.Vector3();
const position_0 = new XThree.Vector3(0, 0, 0);
const quaternion = new XThree.Quaternion();
const scale      = new XThree.Vector3();
const scale_1    = new XThree.Vector3(1, 1, 1);
const mat4_0     = new XThree.Matrix4();
const mat4_1     = new XThree.Matrix4();
const mat4_2     = new XThree.Matrix4();

/**
 * Mixin
 */
Object.assign(XThree.Matrix4.prototype, {
    /**
     * 
     * 移除缩放因子
     * 
     * @returns 
     */
    removeScaleFactor() {
        this.decompose(position, quaternion, scale  );
        mat4_0.compose(position, quaternion, scale_1);
        return mat4_0;
    },

    /**
     * 
     * 只需要旋转矩阵
     * 
     * @returns 
     */
    rotation() {
        this.decompose(position  , quaternion, scale  );
        mat4_0.compose(position_0, quaternion, scale_1);
        return mat4_0;
    },
});
