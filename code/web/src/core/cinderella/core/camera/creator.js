/* eslint-disable no-unused-vars */

import AssociateContainer from './associate-container';
import OrthoCamera        from './ortho-camera';
import PerspectiveCamera  from './perspective-camera';

/**
 * 相机创建
 */
export default class Creator {
    /**
     * 成员变量
     */
    #associate_container = new AssociateContainer();
    #notifyer;
    #scene;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     * @param {*} notifyer 
     */
    constructor(scene, notifyer) {
        this.#scene    = scene;
        this.#notifyer = notifyer;
    }

    /**
     * 
     * 构建正交相机
     * 
     * @returns 
     */
    ortho() {
        return new OrthoCamera(
            this.#notifyer, 
            this.#scene, 
            this.#associate_container);
    }

    /**
     * sss
     * 构建透视相机
     * 
     * @returns 
     */
    perspective() {
        return new PerspectiveCamera(
            this.#notifyer, 
            this.#scene, 
            this.#associate_container);
    }

    /**
     * 
     * 获取容器
     * 
     * @returns 
     */
    getAssociateContainer() {
        return this.#associate_container;
    }

    /**
     * 
     * 根据类型创建不同的相机
     * 
     * @param {string} type 
     */
    create(type) {
        const lowercase = type.toLocaleLowerCase();
        if (lowercase === 'perspective') {
            return this.perspective();
        } else if (lowercase === 'ortho') {
            return this.ortho();
        }
    }
}
