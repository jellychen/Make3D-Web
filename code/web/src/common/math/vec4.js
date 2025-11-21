/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as GLM from 'gl-matrix';

/**
 * 向量
 */
export default class Vec4 {
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
     * @param {Number} w 
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.#data = GLM.vec4.create();
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
        this.#data[2] = z || 0;
        this.#data[3] = w || 0;
    }

    /**
     * 获取内容
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
    get w() {
        return this.#data[3];
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
     */
    set w(value) {
        this.#data[3] = value;
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
        this.#data[3] = 0;
        return this;
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     * @returns 
     */
    set(x = 0, y = 0, z = 0, w = 0) {
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
        this.#data[2] = z || 0;
        this.#data[3] = w || 0;
        return this;
    }

    /**
     * 
     * 设置
     * 
     * @param {Vec3} vec3 
     * @param {Number} w 
     */
    setVec3(vec3, w = 1) {
        this.#data[0] = vec3.data[0];
        this.#data[1] = vec3.data[1];
        this.#data[2] = vec3.data[2];
        this.#data[3] = w;
        return this;
    }

    /**
     * 
     * 矩阵变换
     * 
     * @param {*} mat4 
     * @returns 
     */
    transform(mat4) {
        GLM.vec4.transformMat4(this.#data, this.#data, mat4.data);
        return this;
    }

    /**
     * 
     * 返回向量的长度
     * 
     * @returns 
     */
    length() {
        return GLM.vec4.length(this.#data);
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
        let w = this.#data[3];
        return x * x + y * y + z * z + w * w;
    }

    /**
     * 
     * 向量相加
     * 
     * @param {Vec4} v 
     * @returns 
     */
    add(v) {
        GLM.vec4.add(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相减
     * 
     * @param {Vec4} v 
     * @returns 
     */
    subtract(v) {
        GLM.vec4.subtract(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相除
     * 
     * @param {Vec4} v 
     * @returns 
     */
    divide(v) {
        GLM.vec4.divide(this.#data, this.#data, v.data);
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
        this.#data[3] *= data;
        return this;
    }

    /**
     * 
     * 距离
     * 
     * @param {Vec4} v 
     * @returns 
     */
    distance(v) {
        return GLM.vec4.distance(this.#data, v.data);
    }

    /**
     * 
     * 计算距离的平方
     * 
     * @param {Vec4} v 
     * @returns 
     */
    squaredDistance(v) {
        return GLM.vec4.squaredDistance(this.#data, v.data);
    }

    /**
     * 
     * 向量取反向
     * 
     * @returns 
     */
    negate() {
        GLM.vec4.negate(this.#data);
        return this;
    }

    /**
     * 
     * 取倒数
     * 
     * @returns 
     */
    inverse() {
        GLM.vec4.inverse(this.#data);
        return this;
    }

    /**
     * 
     * 归一化
     * 
     * @returns 
     */
    normalize() {
        GLM.vec4.normalize(this.#data, this.#data);
        return this;
    }

    /**
     * 
     * 点乘
     * 
     * @param {Vec4} v 
     * @returns 
     */
    dot(v) {
        return GLM.vec4.dot(this.#data, v.data);
    }

    /**
     * 
     * 判断相等
     * 
     * @param {Vec4} v 
     * @returns 
     */
    equals(v) {
        return GLM.vec4.equals(this.#data, v.data);
    }

    /**
     * 
     * 值拷贝
     * 
     * @param {Vec4} out 
     */
    copy(out) {
        out.data[0] = this.#data[0];
        out.data[1] = this.#data[1];
        out.data[2] = this.#data[2];
        out.data[3] = this.#data[3];
    }
}
