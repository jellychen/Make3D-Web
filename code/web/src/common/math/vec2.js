/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as GLM from 'gl-matrix';

export default class Vec2 {
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
     */
    constructor(x = 0, y = 0) {
        this.#data = GLM.vec2.create();
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
    }

    /**
     * 获取内容
     */
    get data() {
        return this.#data;
    }

    /**
     * 获取
     */
    get x() {
        return this.#data[0];
    }

    /**
     * 获取
     */
    get y() {
        return this.#data[1];
    }

    /**
     * 获取
     */
    set x(value) {
        this.#data[0] = value;
    }

    /**
     * 获取
     */
    set y(value) {
        this.#data[1] = value;
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
        return this;
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    set(x = 0, y = 0) {
        this.#data[0] = x || 0;
        this.#data[1] = y || 0;
        return this;
    }

    /**
     * 
     * 返回向量的长度
     * 
     * @returns 
     */
    length() {
        return GLM.vec2.length(this.#data);
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
        return x * x + y * y;
    }

    /**
     * 
     * 向量相加
     * 
     * @param {Vec2} v 
     * @returns 
     */
    add(v) {
        GLM.vec2.add(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相减
     * 
     * @param {Vec2} v 
     * @returns 
     */
    subtract(v) {
        GLM.vec2.subtract(this.#data, this.#data, v.data);
        return this;
    }

    /**
     * 
     * 向量相除
     * 
     * @param {Vec2} v 
     * @returns 
     */
    divide(v) {
        GLM.vec2.divide(this.#data, this.#data, v.data);
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
        return this;
    }

    /**
     * 
     * 距离
     * 
     * @param {Vec2} v 
     * @returns 
     */
    distance(v) {
        return GLM.vec2.distance(this.#data, v.data);
    }

    /**
     * 
     * 计算距离的平方
     * 
     * @param {Vec2} v 
     * @returns 
     */
    squaredDistance(v) {
        return GLM.vec2.squaredDistance(this.#data, v.data);
    }

    /**
     * 
     * 归一化
     * 
     * @returns 
     */
    normalize() {
        GLM.vec2.normalize(this.#data, this.#data);
        return this;
    }

    /**
     * 
     * 判断相等
     * 
     * @param {Vec2} v 
     * @returns 
     */
    equals(v) {
        return GLM.vec2.equals(this.#data, v.data);
    }

    /**
     * 
     * 值拷贝
     * 
     * @param {Vec2} out 
     */
    copy(out) {
        out.data[0] = this.#data[0];
        out.data[1] = this.#data[1];
    }
}
