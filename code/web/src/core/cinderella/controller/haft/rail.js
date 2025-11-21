/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';


/**
 * 定义的常量
 */
const _axis_radius       = 0.1;
const _axis_len          = 18;
const _axis_color        = 0xFE5B5D;
const _torus_radius      = 2.0;
const _torus_tube_radius = 0.1;
const _torus_color       = 0xFE5B5D;

/**
 * 引导
 */
export default class Rail extends XThree.Group {
    /**
     * 重绘
     */
    #request_animation_frame = () => {};

    /**
     * 网格
     */
    #mesh_0;
    #mesh_1;

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     */
    constructor(request_animation_frame) {        
        super();
        this.#request_animation_frame = request_animation_frame;

        // 构建 mesh_0
        {
            const geo = new XThree.CylinderGeometry(_axis_radius, _axis_radius, _axis_len, 6);
            geo.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
            const material = new XThreeMaterial.RailFadeoutColor();
            material.setColor(_axis_color);
            material.setRange(4, 8);
            material.depthTest = false;
            this.#mesh_0          = new XThree.Mesh();
            this.#mesh_0.geometry = geo;
            this.#mesh_0.material = material;
        }

        // 构建 mesh_1
        {
            const geo = new XThree.TorusGeometry(_torus_radius, _torus_tube_radius, 6, 16);
            const material        = new XThree.MeshBasicMaterial({ color: _torus_color });
            material.depthTest    = false;
            this.#mesh_1          = new XThree.Mesh();
            this.#mesh_1.geometry = geo;
            this.#mesh_1.material = material;
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {Boolean} show 
     */
    setShow(show) {
        if (true === show) {
            if (!this.#mesh_0.parent) {
                this.add(this.#mesh_0);
                this.#requestAnimationFrameIfNeed();
            }

            if (!this.#mesh_1.parent) {
                this.add(this.#mesh_1);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#mesh_0.parent) {
                this.#mesh_0.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }

            if (this.#mesh_1.parent) {
                this.#mesh_1.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 请求重绘
     */
    #requestAnimationFrameIfNeed() {
        if (this.#request_animation_frame) {
            this.#request_animation_frame();
        }
    }

    /**
     * 废弃
     */
    dispose() {
        this.#mesh_0.dispose();
    }
}
