/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 用来绘制圆点
 */
export default class PointRound extends XThree.Sprite {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.material                 = new XThree.PointsNodeMaterial();
        this.material.sizeAttenuation = false;
        this.material.vertexColors    = false;
        this.material.opacity         = tsl.shapeCircle();
        this.material.colorNode       = tsl.color(0xFFFFFF);
        this.material.size            = 10;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.colorNode = tsl.color(color);
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setSize(size) {
        this.material.size = parseFloat(size);
    }

    /**
     * 
     * 设置锯齿的羽化的距离，默认是4个像素
     * 
     * @param {Number} width 
     */
    setFeather(width) {
        // 不支持
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
            this.setPointsBuffer(new Float32Array(points), false);
        }
    }

    /**
     * 
     * 设置点的Buffer
     * 
     * @param {Float32Array} points_buffer 
     * @param {*} copy 
     */
    setPointsBuffer(points_buffer, copy = false) {
        if (copy) {
            points_buffer = points_buffer.slice();
        }
        const attri = new XThree.InstancedBufferAttribute(points_buffer, 3);
        this.material.positionNode = tsl.instancedBufferAttribute(attri);
        this.count = parseInt(points_buffer.length / 3);
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
