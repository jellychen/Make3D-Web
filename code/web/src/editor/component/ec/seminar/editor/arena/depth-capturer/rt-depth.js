/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 用来获取深度的
 */
export default class RT_Depth {
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
        this.#w                               = w;
        this.#h                               = h;
        this.#render_target                   = new XThree.WebGLRenderTarget(w, h);
        this.#render_target.stencilBuffer     = false;
        this.#render_target.depthBuffer       = true;
        this.#render_target.depthTexture      = new XThree.DepthTexture();
        this.#render_target.depthTexture.type = XThree.FloatType;
    }

    /**
     * 销毁
     */
    dispose() {
        this.#render_target.dispose();
    }
}
