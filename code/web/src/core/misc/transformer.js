/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 临时
 */
const VEC3_0 = new XThree.Vector3();

/**
 * 转化器
 */
export default class Transformer {
    /**
     * 屏幕空间
     */
    #screen_w = 100;
    #screen_h = 100;

    /**
     * 相机
     */
    #camera;

    /**
     * 可以支持从局部坐标转世界坐标
     */
    #mat4 = new XThree.Matrix4();

    /**
     * 组合
     */
    #mat4_combination = new XThree.Matrix4();

    /**
     * 是否需要更新
     */
    #need_update = true;

    /**
     * 标记需要更新
     */
    markNeedUpdate() {
        this.#need_update = true;
    }

    /**
     * 
     * 设置尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     */
    setScreenSize(w, h) {
        this.#screen_w = w;
        this.#screen_h = h;
    }

    /**
     * 
     * 设置相机
     * 
     * @param {*} camera 
     */
    setCamera(camera) {
        this.#camera = camera;
        this.#need_update = true;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} mat4 
     */
    setMat4(mat4) {
        if (mat4) {
            this.#mat4.copy(mat4);
        } else {
            this.#mat4.identity();
        }
        this.#need_update = true;
    }

    /**
     * 
     * 转化
     * 
     * @param {*} vec3 
     * @param {*} target vec3
     * @returns 
     */
    toNDC(vec3, target) {
        if (this.#need_update) {
            this.#mat4_combination.identity();
            this.#mat4_combination.premultiply(this.#mat4);
            this.#mat4_combination.premultiply(this.#camera.matrixWorldInverse);
            this.#mat4_combination.premultiply(this.#camera.projectionMatrix);
            this.#need_update = false;
        }

        target.copy(vec3);
        target.applyMatrix4(this.#mat4_combination);
        target.divideScalar(target.w);
        return target;
    }

    /**
     * 
     * 转化
     * 
     * @param {*} vec3 
     * @param {*} target vec2
     */
    toScreen(vec3, target) {
        const ndc = this.toNDC(vec3, VEC3_0);
        target.x = (ndc.x + 1) / 2 * this.#screen_w;
        target.y = (1 - ndc.y) / 2 * this.#screen_h;
        return target;
    }
}