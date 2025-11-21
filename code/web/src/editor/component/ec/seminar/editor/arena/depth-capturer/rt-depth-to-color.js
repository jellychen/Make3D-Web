/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 深度图
 */
export default class RT_DepthToColor {
    /**
     * rt
     */
    #render_target;

    /**
     * 尺寸
     */
    #w;
    #h;

    /**
     * 获取
     */
    get render_target() {
        return this.#render_target;
    }

    /**
     * 获取
     */
    get texture() {
        return this.#render_target.depthTexture;
    }

    /**
     * 获取
     */
    get w() {
        return this.#w;
    }

    /**
     * 获取 
     */
    get h() {
        return this.#h;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {Number} w 
     * @param {Number} h 
     */
    constructor(w = 1024, h = 1024) {
        this.#w = w;
        this.#h = h;
        this.#render_target = new XThree.WebGLRenderTarget(
            this.#w,
            this.#h,
            {
                format       : XThree.RGBAFormat,
                type         : XThree.UnsignedByteType,
                depthBuffer  : true,
                stencilBuffer: false,
            }
        );
    }

    /**
     * 销毁
     */
    dispose() {
        this.#render_target.dispose();
    }
}
