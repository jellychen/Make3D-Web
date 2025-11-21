/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as GLM from 'gl-matrix';
import Vec4     from './vec4';

/**
 * 临时
 */
const _vec4 = new Vec4();

export default class Vec3 {
    /**
     * 数据
     */
    #data;

    /**
     * 
     * 构造函数
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x = 0, y = 0, z = 0) {
        this.#data = GLM.vec3.create();
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
        this.#data[2] = z || 0;
    }

    /**
     * 获得内容
     */
    get data() {
        return this.#data;
    }

    /**
     * 
     */
    get x() {
        return this.#data[0];
    }

    /**
     * 
     */
    get y() {
        return this.#data[1];
    }

    /**
     * 
     */
    get z() {
        return this.#data[2];
    }

    /**
     * 
     */
    set x(value) {
        this.#data[0] = value;
    }

    /**
     * 
     */
    set y(value) {
        this.#data[1] = value;
    }

    /**
     * 
     */
    set z(value) {
        this.#data[2] = value;
    }

    /**
     * 
     * 全部置零
     * 
     * @returns 
     */
    zero() {
        this.#data[0] = 0;
        this.#data[1] = 0;
        this.#data[2] = 0;
        return this;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    set(x = 0, y = 0, z = 0) {
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
        this.#data[2] = z || 0;
        return this;
    }

    /**
     * 
     * 返回向量的长度
     * 
     * @returns 
     */
    length() {
        return GLM.vec3.length(this.#data);
    }

    /**
     * 
     * 返回向量的长度的平方
     * 
     * @returns 
     */
    squaredLength() {
        let x = this.#data[0];
        let y = this.#data[1];
        let z = this.#data[2];
        return x * x + y * y + z * z;
    }

    /**
     * 
     * 向量相加
     * 
     * @param {Vec3} v 
     * @returns 
     */
    add(v) {
        GLM.vec3.add(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相减
     * 
     * @param {Vec3} v 
     * @returns 
     */
    subtract(v) {
        GLM.vec3.subtract(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相除
     * 
     * @param {Vec3} v 
     * @returns 
     */
    divide(v) {
        GLM.vec3.divide(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 缩放
     * 
     * @param {Number} data 
     */
    scale(data) {
        this.#data[0] *= data;
        this.#data[1] *= data;
        this.#data[2] *= data;
        return this;
    }

    /**
     * 
     * 距离
     * 
     * @param {Vec3} v 
     * @returns 
     */
    distance(v) {
        return GLM.vec3.distance(this.#data, v.data);
    }

    /**
     * 
     * 计算距离的平方
     * 
     * @param {Vec3} v 
     * @returns 
     */
    squaredDistance(v) {
        return GLM.vec3.squaredDistance(this.#data, v.data);
    }

    /**
     * 
     * 向量取反向
     * 
     * @returns 
     */
    negate() {
        GLM.vec3.negate(this.#data, this.#data);
        return this;
    }

    /**
     * 
     * 取倒数
     * 
     * @returns 
     */
    inverse() {
        GLM.vec3.inverse(this.#data, this.#data);
        return this;
    }

    /**
     * 
     * 归一化
     * 
     * @returns 
     */
    normalize() {
        GLM.vec3.normalize(this.#data, this.#data);
        return this;
    }

    /**
     * 
     * 点乘
     * 
     * @param {Vec3} v 
     * @returns 
     */
    dot(v) {
        return GLM.vec3.dot(this.#data, v.data);
    }

    /**
     * 
     * 叉乘
     * 
     * @param {Vec3} v 
     * @returns 
     */
    postCross(v) {
        GLM.vec3.cross(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 叉乘
     * 
     * @param {*} v 
     * @returns 
     */
    preCross(v) {
        GLM.vec3.cross(this.#data, v.data, this.#data);
        return this;
    }
    
    /**
     * 
     * 矩阵变换
     * 
     * @param {Mat4} mat4 
     */
    transform(mat4) {
        _vec4.setVec3(this).transform(mat4);
        let w = _vec4.data[3];
        this.#data[0] = _vec4.data[0] / w;
        this.#data[1] = _vec4.data[1] / w;
        this.#data[2] = _vec4.data[2] / w;
        return this;
    }

    /**
     * 
     * 判断相等
     * 
     * @param {Vec3} v 
     * @returns 
     */
    equals(v) {
        return GLM.vec3.equals(this.#data, v.data);
    }

    /**
     * 
     * 值拷贝
     * 
     * @param {Vec3} out 
     */
    copy(out) {
        out.data[0] = this.#data[0];
        out.data[1] = this.#data[1];
        out.data[2] = this.#data[2];
    }
}
