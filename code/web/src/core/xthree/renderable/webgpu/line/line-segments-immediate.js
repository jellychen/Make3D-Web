/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as TSL    from 'three/tsl';

/**
 * 细线，
 */
export default class LineSegmentsImmediate extends XThree.LineSegments {
    /**
     * 构造函数
     */
    constructor() {
        super(new XThree.BufferGeometry(), new XThree.LineBasicNodeMaterial({
            color       : 0xFFFFFF,
            vertexColors: false,
            depthTest   : true,
            depthWrite  : true,
        }));
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.color = TSL.color(0xFFFFFF);
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
     * @param {Array|Float32Array} points
     */
    setSegments(points) {
        if (!(points instanceof Float32Array)) {
            this.setSegmentsBuffer(new XThree.Float32BufferAttribute(points, 3));
        }
        return this;
    }

    /**
     * 
     * 设置线段的点的Buffer
     * 
     * @param {Float32Array} points_buffer
     */
    setSegmentsBuffer(points_buffer) {
        this.geometry.dispose();
        this.geometry = new XThree.BufferGeometry();
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
