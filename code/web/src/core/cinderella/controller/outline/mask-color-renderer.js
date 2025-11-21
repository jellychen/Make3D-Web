/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';

/**
 * 渲染深度的材质
 */
const MaskColorSolidMaterial = new XThreeMaterial.MaskColorSolid();

/**
 * 用来对场景的指定的物体，渲染成掩码图
 */
export default class MaskColorRenderer {
    /**
     * 渲染器
     */
    #renderer;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 渲染目标
     */
    #render_target;

    /**
     * 获取宽度
     */
    get width() {
        return this.#w;
    }

    /**
     * 获取高度
     */
    get height() {
        return this.#h;
    }

    /**
     * 获取渲染好的图
     */
    get texture() {
        if (this.#render_target) {
            return this.#render_target.texture;
        }
        return undefined;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer 
     */
    constructor(renderer) {
        this.#renderer = renderer;
    }

    /**
     * 
     * 设置尺寸
     * 
     * @param {Number} width 
     * @param {Number} height
     */
    resize(width, height) {
        this.#w = width;
        this.#h = height;
    }

    /**
     * 
     * 渲染颜色掩码图
     * 
     * @param {*} scene 
     * @param {*} camera 
     */
    render(scene, camera) {
        if (this.#w <= 0 || this.#h <= 0) {
            return false;
        }

        //
        // 如果尺寸不对，需要重新构建 WebGLRenderTarget
        //
        const w = this.#render_target? this.#render_target.width : 0;
        const h = this.#render_target? this.#render_target.height: 0;
        if (!this.#render_target || this.#w != w || this.#h != h) {
            if (this.#render_target) {
                this.#render_target.dispose();
                this.#render_target = undefined;
            }

            this.#render_target = new XThree.WebGLRenderTarget(
                this.#w, 
                this.#h, {
                    format       : XThree.RedFormat,
                    type         : XThree.FloatType,
                    depthBuffer  : true,
                    stencilBuffer: false
                }
            );
        }

        // 设置新的覆盖材质
        const old_override_material = scene.overrideMaterial;
        scene.overrideMaterial      = MaskColorSolidMaterial;

        // 执行渲染
        const old_render_target = this.#renderer.getRenderTarget();
        this.#renderer.setRenderTarget(this.#render_target);
        this.#renderer.setClearColor(0, 0);
        this.#renderer.clearColor();
        this.#renderer.clearDepth();
        this.#renderer.render(scene, camera);
        this.#renderer.setRenderTarget(old_render_target);

        // 恢复覆盖材质
        scene.overrideMaterial = old_override_material;

        return true;
    }

    /**
     * 废弃
     */
    dispose() {
        if (this.#render_target) {
            this.#render_target.dispose();
            this.#render_target = undefined;
        }
    }
}
