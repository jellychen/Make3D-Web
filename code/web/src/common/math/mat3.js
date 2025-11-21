/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as GLM from 'gl-matrix';

/**
 * Mat4
 */
export default class Mat3 {
    /**
     * 数据
     */
    #data;

    /**
     * 构造函数
     */
    constructor() {
        this.#data = GLM.mat3.create();
    }

    /**
     * 获取内容
     */
    get data() {
        return this.#data;
    }

    /**
     * 
     * 单位化
     * 
     * @returns 
     */
    identity() {
        GLM.mat3.identity(this.#data);
        return this;
    }

    /**
     * 
     * 右乘
     * 
     * @param {mat3} m 
     * @returns 
     */
    postMultiply(m) {
        GLM.mat3.multiply(this.#data, this.#data, m.data);
        return this;
    }

    /**
     * 
     * 左乘
     * 
     * @param {*} m 
     * @returns 
     */
    preMultiply(m) {
        GLM.mat3.multiply(this.#data, m.data, this.#data);
        return this;
    }

    /**
     * 
     * 平移
     * 
     * @param {vec2} vec3 
     * @returns 
     */
    translate(vec2) {
        GLM.mat3.translate(this.#data, this.#data, vec2.data);
        return this;
    }

    /**
     * 
     * 缩放矩阵
     * 
     * @param {vec2} vec3 
     * @returns 
     */
    scale(vec2) {
        GLM.mat3.scale(this.#data, this.#data, vec2.data);
        return this;
    }

    /**
     * 
     * 旋转
     * 
     * @param {Number} rad 
     * @returns 
     */
    rotate(rad) {
        GLM.mat3.rotate(this.#data, this.#data, rad);
        return this;
    }
}
