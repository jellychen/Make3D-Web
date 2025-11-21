/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import Transformer from '@core/misc/transformer';

/**
 * 临时变量
 */
const VEC2_0 = new XThree.Vector2();
const VEC3_0 = new XThree.Vector3();

/**
 * 拾取
 */
export default class Picker {
    /**
     * 射线
     */
    #raycaster = new XThree.Raycaster();

    /**
     * 屏幕空间
     */
    #screen_w = 100;
    #screen_h = 100;

    /**
     * 变换
     */
    #transformer = new Transformer();

    /**
     * 获取
     */
    get screen_w() {
        return this.#screen_w;
    }

    /**
     * 获取
     */
    get screen_h() {
        return this.#screen_h;
    }

    /**
     * 获取
     */
    get ray() {
        return this.#raycaster.ray;
    }

    /**
     * 获取
     */
    get transformer() {
        return this.#transformer;
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
        this.#transformer.setScreenSize(w, h);
    }

    /**
     * 
     * 设置射线
     * 
     * @param {*} camera 
     * @param {*} ndc_x 
     * @param {*} ndc_y 
     */
    setupRaycaster(camera, ndc_x, ndc_y) {
        VEC2_0.x = ndc_x;
        VEC2_0.y = ndc_y;
        this.#raycaster.setFromCamera(VEC2_0, camera);
    }

    /**
     * 
     * 判断点是不是在射线前方
     * 
     * @param {*} vec3 
     * @returns 
     */
    isFrontOf(vec3) {
        const ray = this.#raycaster.ray;
        VEC3_0.copy(vec3);
        VEC3_0.sub(ray.origin);
        return VEC3_0.dot(ray.direction) >= 0;
    }
}
