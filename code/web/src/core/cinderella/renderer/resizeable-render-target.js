/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 支持缩放的RenderTarget
 */
export default class ResizeableRenderTarget {
    /**
     * 渲染目标
     */
    #render_target;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 参数
     */
    #format       = XThree.RGBAFormat;
    #type         = XThree.UnsignedByteType;
    #need_depth   = true;
    #need_stencil = false;

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
    get renderTarget() {
        const w = this.#render_target? this.#render_target.width : 0;
        const h = this.#render_target? this.#render_target.height: 0;
        if (!this.#render_target || this.#w != w || this.#h != h) {
            if (this.#render_target) {
                this.#render_target.dispose();
                this.#render_target = undefined;
            }

            if (this.#w <= 0 || this.#h <= 0) {
                return undefined;
            }

            this.#render_target = new XThree.RenderTarget(
                this.#w,
                this.#h,
                {
                    format       : this.#format,
                    type         : this.#type,
                    depthBuffer  : this.#need_depth,
                    stencilBuffer: this.#need_stencil,
                }
            );
        }
        return this.#render_target;
    }

    /**
     * 获取
     */
    get texture() {
        if (this.#render_target) {
            return this.#render_target.texture;
        }
        return null;
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
    constructor(format, type, need_depth, need_stencil) {
        this.#format = format || XThree.RGBAFormat;
        this.#type = type || XThree.UnsignedByteType;
        this.#need_depth   = need_depth   === true;
        this.#need_stencil = need_stencil === true;
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
    }

    /**
     * 销毁
     */
    dispose() {
        if (undefined != this.#render_target) {
            this.#render_target.dispose();
            this.#render_target = undefined;
        }
    }
}
