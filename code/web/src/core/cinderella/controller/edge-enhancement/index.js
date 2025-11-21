/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree            from '@xthree/basic';
import XThreeMaterial    from '@xthree/material';
import FullScreenRect    from '../../mesh/embedded/full-screen-rect';
import MaskColorRenderer from './mask-color-renderer';

/**
 * 用来做边缘效果增强
 */
export default class EdgeEnhancement {
    /**
     * 渲染器
     */
    #renderer;

    /**
     * 用来渲染的MESH
     */
    #mesh_material = new XThreeMaterial.EdgeEnhancement();
    #mesh          = new XThree.Mesh();

    /**
     * 绘制掩码图
     */
    #mask_renderer;

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer 
     */
    constructor(renderer) {
        this.#renderer      = renderer;
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
     * 设置强度
     * 
     * @param {Number} intensity 
     */
    setIntensity(intensity = 0.5) {
        this.#mesh_material.setIntensity(intensity);
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} scene
     * @param {*} camera
     */
    render(scene, camera) {
        this.#mask_renderer.render(scene, camera);
        camera.layers.enableAll();
        this.#renderer.autoClear = false;
        this.#mesh_material.setMask(this.#mask_renderer.texture);
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
