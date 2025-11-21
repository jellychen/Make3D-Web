/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';

/**
 * 定义的常量
 */
const _axis_radius  = 0.12;
const _axis_len     = 48;
const _axis_x_color = 0xFE5B5D;
const _axis_y_color = 0x36E2B3;
const _axis_z_color = 0x239CFF;

/**
 * 指引的轨迹
 */
export default class Rail extends XThree.Group {
    /**
     * mesh
     */
    #x;
    #y;
    #z;

    /**
     * 
     */
    #request_animation_frame = () => {};

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();
        this.#request_animation_frame = request_animation_frame;

        // x轴
        {
            let geo = new XThree.CylinderGeometry(_axis_radius, _axis_radius, _axis_len, 6);
            geo.applyMatrix4(new XThree.Matrix4().makeRotationZ(-Math.PI / 2.0));
            let material = new XThreeMaterial.RailFadeoutColor();
            material.setColor(_axis_x_color);
            material.setRange(15, 24);
            let mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            this.#x = mesh;
        }

        // y轴
        {
            let geo = new XThree.CylinderGeometry(_axis_radius, _axis_radius, _axis_len, 6);
            let material = new XThreeMaterial.RailFadeoutColor();
            material.setColor(_axis_y_color);
            material.setRange(15, 24);
            let mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            this.#y = mesh;
        }

        // z轴
        {
            let geo = new XThree.CylinderGeometry(_axis_radius, _axis_radius, _axis_len, 6);
            geo.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
            let material = new XThreeMaterial.RailFadeoutColor();
            material.setColor(_axis_z_color);
            material.setRange(15, 24);
            let mesh = new XThree.Mesh();
            mesh.geometry = geo;
            mesh.material = material;
            this.#z = mesh;
        }
    }

    /**
     * 
     * 显示X轴
     * 
     * @param {boolean} show 
     */
    setShowX(show) {
        if (true === show) {
            if (!this.#x.parent) {
                this.add(this.#x);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#x.parent) {
                this.#x.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示Y轴
     * 
     * @param {boolean} show 
     */
    setShowY(show) {
        if (true === show) {
            if (!this.#y.parent) {
                this.add(this.#y);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#y.parent) {
                this.#y.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 
     * 显示Z轴
     * 
     * @param {boolean} show 
     */
    setShowZ(show) {
        if (true === show) {
            if (!this.#z.parent) {
                this.add(this.#z);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#z.parent) {
                this.#z.removeFromParent();
                this.#requestAnimationFrameIfNeed();
            }
        }
    }

    /**
     * 显示全部
     */
    setShowAll() {
        this.setShowX(true);
        this.setShowY(true);
        this.setShowZ(true);
    }

    /**
     * 隐藏全部
     */
    setAllHidden() {
        this.#x.removeFromParent();
        this.#y.removeFromParent();
        this.#z.removeFromParent();
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
        this.#x.dispose();
        this.#y.dispose();
        this.#z.dispose();
    }
}
