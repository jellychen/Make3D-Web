/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree        from 'three';
import PointRoundMaterial from './point-round-material';

/**
 * 用来绘制圆点
 */
export default class PointRound extends XThree.Points {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.material = new PointRoundMaterial();
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
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.setColor(color);
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setSize(size) {
        this.material.setPointSize(size);
    }

    /**
     * 
     * 设置狂锯齿的羽化的距离，默认是4个像素
     * 
     * @param {Number} width 
     */
    setFeather(width) {
        this.material.setFeather(width);
    }

    /**
     * 
     * 设置点
     * 
     * @param {Array|Float32Array} points
     * @param {*} copy 
     */
    setPoints(points, copy = false) {
        if (points instanceof Float32Array) {
            this.setPointsBuffer(points, copy);
        } else {
            this.geometry.setAttribute('position', new XThree.Float32BufferAttribute(points, 3));
        }
    }

    /**
     * 
     * 设置点的Buffer
     * 
     * @param {Array|Float32Array} points_buffer 
     * @param {*} copy 
     */
    setPointsBuffer(points_buffer, copy = false) {
        if (true == copy) {
            this.geometry.setAttribute('position', new XThree.Float32BufferAttribute(points_buffer, 3));
        } else {
            this.geometry.setAttribute('position', new XThree.BufferAttribute(points_buffer, 3));
        }
    }

    /**
     * 
     * 开启或者关闭深度写入
     * 
     * @param {boolean} enable 
     */
    setEnableWriteDepth(enable) {
        this.material.depthWrite = true == enable;
    }

    /**
     * 销毁
     */
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
