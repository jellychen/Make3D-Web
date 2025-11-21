/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as GLM from 'gl-matrix';

/**
 * Mat4
 */
export default class Mat4 {
    /**
     * 数据
     */
    #data;

    /**
     * 构造函数
     */
    constructor() {
        this.#data = GLM.mat4.create();
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
        GLM.mat4.identity(this.#data);
        return this;
    }

    /**
     * 
     * 转置
     * 
     * @returns 
     */
    transpose() {
        GLM.mat4.transpose(this.#data);
        return this;
    }

    /**
     * 
     * 逆
     * 
     * @returns 
     */
    invert() {
        GLM.mat4.invert(this.#data);
        return this;
    }

    /**
     * 
     * 右乘
     * 
     * @param {Mat4} m 
     * @returns 
     */
    postMultiply(m) {
        GLM.mat4.multiply(this.#data, this.#data, m.data);
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
        GLM.mat4.multiply(this.#data, m.data, this.#data);
        return this;
    }

    /**
     * 
     * 平移
     * 
     * @param {Vec3} vec3 
     * @returns 
     */
    translate(vec3) {
        GLM.mat4.translate(this.#data, this.#data, vec3.data);
        return this;
    }

    /**
     * 
     * 缩放矩阵
     * 
     * @param {Vec3} vec3 
     * @returns 
     */
    scale(vec3) {
        GLM.mat4.scale(this.#data, this.#data, vec3.data);
        return this;
    }

    /**
     * 
     * 旋转
     * 
     * @param {Number} rad 
     * @param {Vec3} axis 
     * @returns 
     */
    rotate(rad, axis) {
        GLM.mat4.rotate(this.#data, this.#data, rad, axis.data);
        return this;
    }

    /**
     * 
     * 构建透视矩阵，Z range of [-1, 1]
     * 
     * @param {*} fovy 
     * @param {*} aspect 
     * @param {*} near 
     * @param {*} far 
     */
    perspectiveNO(fovy, aspect, near, far) {
        GLM.mat4.perspectiveNO(this.#data, fovy, aspect, near, far);
        return this;
    }

    /**
     * 
     * 构建透视矩阵，Z range of [+0, 1]
     * 
     * @param {*} fovy 
     * @param {*} aspect 
     * @param {*} near 
     * @param {*} far 
     * @returns 
     */
    perspectiveZO(fovy, aspect, near, far) {
        GLM.mat4.perspectiveZO(this.#data, fovy, aspect, near, far);
        return this;
    }
    
    /**
     * 
     * perspectiveNO 别名函数
     * 
     * @param {*} fovy 
     * @param {*} aspect 
     * @param {*} near 
     * @param {*} far 
     * @returns 
     */
    perspective(fovy, aspect, near, far) {
        return this.perspectiveNO(fovy, aspect, near, far);
    }

    /**
     * 
     * 正交投影，Z range of [-1, 1]
     * 
     * @param {*} left 
     * @param {*} right 
     * @param {*} bottom 
     * @param {*} top 
     * @param {*} near 
     * @param {*} far 
     */
    orthoNO(left, right, bottom, top, near, far) {
        GLM.mat4.orthoNO(this.#data, left, right, bottom, top, near, far);
        return this;
    }

    /**
     * 
     * 正交投影，Z range of [+0, 1]
     * 
     * @param {*} left 
     * @param {*} right 
     * @param {*} bottom 
     * @param {*} top 
     * @param {*} near 
     * @param {*} far 
     * @returns 
     */
    orthoZO(left, right, bottom, top, near, far) {
        GLM.mat4.orthoZO(this.#data, left, right, bottom, top, near, far);
        return this;
    }

    /**
     * 
     * orthoNO的别名函数
     * 
     * @param {*} left 
     * @param {*} right 
     * @param {*} bottom 
     * @param {*} top 
     * @param {*} near 
     * @param {*} far 
     * @returns 
     */
    ortho(left, right, bottom, top, near, far) {
        return this.orthoNO(left, right, bottom, top, near, far);
    }

    /**
     * 
     * LookAt
     * 
     * @param {Vec3} eye 
     * @param {Vec3} center 
     * @param {Vec3} up 
     */
    lookat(eye, center, up) {
        GLM.mat4.lookAt(this.#data, eye.data, center.data, up.data);
        return this;
    }

    /**
     * 
     * 判断相等
     * 
     * @param {*} m 
     * @returns 
     */
    equals(m) {
        return GLM.mat4.equals(this.#data, m.data);
    }

    /**
     * 
     * 值拷贝
     * 
     * @param {*} out 
     */
    copy(out) {
        GLM.mat4.copy(out.data, this.#data);
    }
}
