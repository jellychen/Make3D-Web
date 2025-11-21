/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree            from '@xthree/basic';
import XThreeMaterial    from '@xthree/material';
import FullScreenRect    from '../../mesh/embedded/full-screen-rect';
import MaskColorRenderer from './mask-color-renderer';

/**
 * 绘制描边
 */
export default class Outline {
    /**
     * 渲染器
     */
    #renderer;

    /**
     * 绘制掩码图
     */
    #mask_renderer;

    /**
     * 用来渲染的MESH
     */
    #mesh_material = new XThreeMaterial.SOBEL();
    #mesh          = new XThree.Mesh();
    
    /**
     * 获取宽度
     */
    get width() {
        return this.#mask_renderer.width;
    }

    /**
     * 获取高度
     */
    get height() {
        return this.#mask_renderer.height;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer 
     * @param {*} color 
     */
    constructor(renderer, color = 0xFFFFFF) {
        this.#renderer = renderer;
        this.#mesh_material.setColor(color);
        this.#mask_renderer = new MaskColorRenderer(renderer);
        this.#mesh.material = this.#mesh_material;
        this.#mesh.geometry = FullScreenRect.getInstance();
    }

    /**
     * 
     * 设置显示的尺寸
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        const w = width  * pixel_ratio;
        const h = height * pixel_ratio;
        this.#mask_renderer.resize(w, h);
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#mesh_material.setColor(color);
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} scene
     * @param {*} camera
     */
    render(scene, camera) {
        this.#renderer.autoClear = false;
        this.#mask_renderer.render(scene, camera);
        this.#mesh_material.setMask(this.#mask_renderer.texture);
        camera.layers.enableAll();
        this.#renderer.render(this.#mesh, camera);
    }

    /**
     * 废弃
     */
    dispose() {
        this.#mask_renderer.dispose();
        this.#mesh.dispose(false, true);
    }
}
