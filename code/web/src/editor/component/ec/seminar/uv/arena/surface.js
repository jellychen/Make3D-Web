/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import AspectColor from '@xthree/material/aspect-color-not-smooth';

/**
 * Surface
 */
export default class Surface extends XThree.Mesh {
    /**
     * 材质
     */
    #material = new AspectColor();

    /**
     * 构造函数
     */
    constructor() {
        super();

        // 渲染次序
        this.renderOrder = 1;

        // 关闭踢出
        this.frustumCulled = false;

        // 调整材质参数
        this.material = this.#material;
        this.material.polygonOffset       = true;
        this.material.polygonOffsetFactor = 1;
        this.material.polygonOffsetUnits  = 1;
        this.material.side                = XThree.DoubleSide;

        // 预分配
        this.geometry = new XThree.BufferGeometry();
        this.geometry.boundingBox    = new XThree.Box3();
        this.geometry.boundingSphere = new XThree.Sphere();
    }

    /**
     * 
     * 设置正面颜色
     * 
     * @param {*} color 
     */
    setFrontColor(color) {
        this.material.setFrontColor(color);
    }

    /**
     * 
     * 设置背面颜色
     * 
     * @param {*} color 
     */
    setBackColor(color) {
        this.material.setBackColor(color);
    }

    /**
     * 
     * 设置半透明
     * 
     * @param {boolean} transparent 
     * @param {Number} opacity 
     */
    setTransparent(transparent, opacity) {
        this.material.setTransparent(true === transparent, opacity);
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
        ;
    }

    /**
     * 
     * 设置点的位置
     * 
     * @param {*} buffer 
     */
    setVerticesPosition(buffer) {
        this.geometry.setAttr('position', buffer, 3, true);
    }

    /**
     * 
     * 设置渲染的索引
     * 
     * @param {*} indices32 
     */
    setIndices(indices32) {
        this.geometry.setIndices32(indices32, true);
    }

    /**
     * 销毁
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
