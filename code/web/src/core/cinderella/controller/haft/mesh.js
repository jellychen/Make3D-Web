/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree                   from '@xthree/basic';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils';

/**
 * 定义的常量
 */
const _axis_len         = 3;
const _axis_radius      = 0.12;
const _axis_ball_radius = 0.6;
const _color            = 0x239CFF;
const _color_highlight  = 0xFE5B5D;

/**
 * 网格
 */
export default class Mesh extends XThree.Group {
    /**
     * 请求下一帧重绘
     */
    #request_animation_frame = () => {};
    
    /**
     * 网格
     */
    #mesh;
    #mesh_is_highlight = false;

    /**
     * 构造函数
     */
    constructor(request_animation_frame) {
        super();
        this.#request_animation_frame = request_animation_frame;
        this.build();
    }

    /**
     * 
     * 构建网格
     * 
     * @param {*} container 
     */
    build() {
        const geo_0 = new XThree.CylinderGeometry(_axis_radius, _axis_radius, _axis_len, 16);
        geo_0.applyMatrix4(new XThree.Matrix4().makeRotationX(+Math.PI / 2.0));
        geo_0.applyMatrix4(new XThree.Matrix4().makeTranslation(0, 0, _axis_len / 2));
        const geo_1 = new XThree.SphereGeometry(_axis_ball_radius, 16, 8);
        geo_1.applyMatrix4(new XThree.Matrix4().makeTranslation(0, 0, _axis_len));
        const geo = BufferGeometryUtils.mergeGeometries([geo_0, geo_1]);
        geo_0.dispose();
        geo_1.dispose();

        const material      = new XThree.MeshBasicMaterial();
        material.color      = new XThree.Color(_color);
        material.depthTest  = false;
        this.#mesh          = new XThree.Mesh();
        this.#mesh.geometry = geo;
        this.#mesh.material = material;
        this.add(this.#mesh);
    }

    /**
     * 
     * 获取轴的长度
     * 
     * @returns 
     */
    getAxisLen() {
        return _axis_len;
    }

    /**
     * 
     * 获取轴的半径
     * 
     * @returns 
     */
    getAxisRadius() {
        return _axis_radius;
    }

    /**
     * 
     * 获取顶部球的半径
     * 
     * @returns 
     */
    getAxisBallRadius() {
        return _axis_ball_radius;
    }

    /**
     * 
     * 设置高亮
     * 
     * @param {*} highlight 
     */
    setHighlight(highlight) {
        if (highlight) {
            if (!this.#mesh_is_highlight) {
                this.#mesh.material.color.setHex(_color_highlight);
                this.#requestAnimationFrameIfNeed();
            }
        } else {
            if (this.#mesh_is_highlight) {
                this.#mesh.material.color.setHex(_color);
                this.#requestAnimationFrameIfNeed();
            }
        }
        this.#mesh_is_highlight = highlight;
    }

    /**
     * 
     * 判断是不是高亮
     * 
     * @returns boolean
     */
    isHighlight() {
        return this.#mesh_is_highlight;
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
     * 销毁
     */
    dispose() {
        this.#mesh.geometry.dispose();
        this.#mesh.material.dispose();
    }
}
