/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * 细线，
 */
export default class LineSegmentsImmediate extends XThree.LineSegments {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.material              = new XThree.LineBasicMaterial();
        this.material.color        = new XThree.Color(0xFFFFFF);
        this.material.vertexColors = false;
        this.material.depthTest    = true;
        this.material.depthWrite   = true;
        this.geometry              = new XThree.BufferGeometry();
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.color.setHex(color);
        return this;
    }

    /**
     * 
     * 开启或者关闭深度剔除
     * 
     * @param {boolean} enable 
     */
    setEnableDepthTest(enable) {
        this.material.depthTest = true == enable;
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {*} points 
     */
    setSegments(points) {
        this.geometry.setAttribute('position', new XThree.Float32BufferAttribute(points, 3));
        return this;
    }

    /**
     * 
     * 设置线段的点的Buffer
     * 
     * @param {Float32Array} points_buffer
     */
    setSegmentsBuffer(points_buffer) {
        this.geometry.setAttribute('position', new XThree.BufferAttribute(points_buffer, 3));
        return this;
    }

    /**
     * 销毁
     */
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
