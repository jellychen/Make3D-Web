/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 正交相机
 */
export default class OrthoCamera extends XThree.OrthographicCamera {
    /**
     * 成员变量
     */
    #notifyer;              // 接受消息
    #on_resize_callback;    // 大小变化
    #associate_container;

    /**
     * 正交相机的缩放比例
     */
    #ortho_camera_factor = 1.0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} notifyer 
     * @param {*} scene 
     * @param {*} associate_container 
     */
    constructor(notifyer, scene, associate_container) {
        super();
        this.#on_resize_callback  = data => this.resize(data.width, data.height);
        this.#associate_container = associate_container;
        this.#notifyer            = notifyer;
        this.#notifyer.addEventListener('resize', this.#on_resize_callback);
        this.#associate_container.add(this);
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} object 
     */
    copyTransform(object) {
        this.position  .copy(object.position);
        this.quaternion.copy(object.quaternion);
        this.scale     .copy(object.scale);
    }

    /**
     * 
     * 设置正交相机
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} near 
     * @param {Number} far 
     * @param {Number} factor 
     */
    setOrtho(width, height, near, far, factor) {
        this.#ortho_camera_factor = factor;
        this.near                 = near;
        this.far                  = far;
        this.resize(width, height);
    }

    /**
     * 
     * 设置相机的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }

    /**
     * 
     * 设置相机的头向量
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setUp(x, y, z) {
        this.up.set(x, y, z);
    }

    /**
     * 
     * 设置相机看向哪里
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setLookAt(x, y, z) {
        this.lookAt(x, y, z);
    }

    /**
     * 
     * 画面尺寸发生了变化
     * 
     * @param {*} width 
     * @param {*} height 
     */
    resize(width, height) {
        let factor  = 2 * this.#ortho_camera_factor;
        this.left   = - width  / factor;
        this.right  = + width  / factor;
        this.top    = + height / factor;
        this.bottom = - height / factor;
        this.updateProjectionMatrix();
    }

    /**
     * 清理
     */
    dispose() {
        super.dispose();
        this.#associate_container.del(this);
        this.#notifyer.removeEventListener('resize', this.#on_resize_callback);
    }
}
