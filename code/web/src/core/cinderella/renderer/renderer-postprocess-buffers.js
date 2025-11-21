/* eslint-disable no-unused-vars */

import XThree                 from '@xthree/basic';
import ResizeableRenderTarget from './resizeable-render-target';

/**
 * 后处理的双缓冲
 */
export default class RendererPostprocessBuffers {
    /**
     * 双缓冲
     */
    #render_target_r;
    #render_target_w;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 获取像素宽度
     */
    get width() {
        return this.#w;
    }

    /**
     * 获取像素高度
     */
    get height() {
        return this.#h;
    }

    /**
     * 获得读取
     */
    get readRenderTarget() {
        return this.#render_target_r.renderTarget;
    }

    /**
     * 获取
     */
    get readRenderTexture() {
        return this.#render_target_r.texture;
    }

    /**
     * 获取写入
     */
    get writeRenderTarget() {
        return this.#render_target_w.renderTarget;
    }

    /**
     * 获取
     */
    get writeRenderTexture() {
        return this.#render_target_w.texture;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} format 
     * @param {*} type 
     * @param {*} need_depth 
     * @param {*} need_stencil 
     */
    constructor(format       = XThree.RGBAFormat, 
                type         = XThree.UnsignedByteType, 
                need_depth   = true, 
                need_stencil = false) {
        this.#render_target_r = new ResizeableRenderTarget(format, type, need_depth, need_stencil);
        this.#render_target_w = new ResizeableRenderTarget(format, type, need_depth, need_stencil);
    }

    /**
     * 
     * 重置尺寸
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#w = pixel_ratio * width;
        this.#h = pixel_ratio * height;
        this.#render_target_r.resize(pixel_ratio, width, height);
        this.#render_target_w.resize(pixel_ratio, width, height);
    }

    /**
     * 反转
     */
    swapbuffers() {
        const temp_buffer     = this.#render_target_r;
        this.#render_target_r = this.#render_target_w;
        this.#render_target_w = temp_buffer;
    }

    /**
     * 销毁
     */
    dispose() {
        this.#render_target_r.dispose();
        this.#render_target_w.dispose();
    }
}
