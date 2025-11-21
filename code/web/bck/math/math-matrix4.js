/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 临时变量
 */
let _position   = new XThree.Vector3();
let _scale      = new XThree.Vector3();
let _quaternion = new XThree.Quaternion();
let _vec3_z     = new XThree.Vector3(0, 0, 1);
let _vec3_0     = new XThree.Vector3();
let _vec3_1     = new XThree.Vector3();
let _vec3_2     = new XThree.Vector3();
let _mat4_0     = new XThree.Matrix4();

/**
 * mat4 扩展函数功能
 */
export default {
    /**
     * 
     * 对mat4矩阵移除缩放因子
     * 
     * @param {*} mat4 
     */
    eliminateScale(mat4) {
        // 矩阵分解
        mat4.decompose(_position, _quaternion, _scale);

        // 重置缩放
        _scale.x = 1;
        _scale.y = 1;
        _scale.z = 1;
        
        // 重新合成
        mat4.compose(_position, _quaternion, _scale);
    },

    /**
     * 
     * 把单位坐标系下的 Z轴调整到 Z-dir方向
     * 
     * @param {*} z_dir 
     */
    calibrate(z_dir) {
        _vec3_0.copy(z_dir);
        _vec3_0.normalize();
        _vec3_1.x = 0;
        _vec3_1.y = 0;
        _vec3_1.z = 1;
        let raxis = _vec3_1.cross(_vec3_0).normalize();
        let angle = Math.acos(_vec3_0.dot(_vec3_1));
        let m     = new XThree.Matrix4();
        m.makeRotationAxis(raxis, angle);
        return m;
    },
}
