/* eslint-disable no-unused-vars */

import XThree        from '@xthree/basic';
import PointMaterial from '@xthree/material/round-point';
import Constants     from './constants';

/**
 * 点
 */
export default class Points extends XThree.Points {
    /**
     * 材质
     */
    #material = new PointMaterial();

    /**
     * 尺寸
     */
    #size = 4;
    #pixel_size = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} vertices 
     * @param {*} vertices_normal 
     */
    constructor(vertices, vertices_normal) {
        super();

        // 渲染次序
        this.renderOrder = 3;

        // 关闭踢出
        this.frustumCulled = false;

        // 属性
        this.#size = Constants.POINT_SIZE;

        // 规避Threejs自动计算
        this.geometry.boundingBox = new XThree.Box3();
        this.geometry.boundingSphere = new XThree.Sphere();
        this.geometry.setAttribute('position', vertices);

        // 材质
        this.material = this.#material;
        this.material.setColor(Constants.COLOR_POINT_NORMAL);
        this.material.setFeather(0.2);
    }

    /**
     * 
     * 更新几何
     * 
     * @param {*} attribute_points 
     */
    updateAttributePoints(attribute_points) {
        this.geometry.setAttribute('position', attribute_points);
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setSize(size) {
        this.#size = parseFloat(size);
        return this;
    }

    /**
     * 设置显示小点
     */
    setShowSmall() {
        this.setSize(Constants.POINT_SIZE_SMALL);
    }

    /**
     * 设置显示大点
     */
    setShowBig() {
        this.setSize(Constants.POINT_SIZE_BIG);
    }

    /**
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameBegin(renderer_pipeline, renderer, camera) {
        const ps = this.#size * renderer_pipeline.pixelRatio;
        if (this.#pixel_size === ps) {
            return;
        } else {
            this.#pixel_size = ps;
        }
        
        if (this.material) {
            this.material.setPointSize(this.#pixel_size);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
