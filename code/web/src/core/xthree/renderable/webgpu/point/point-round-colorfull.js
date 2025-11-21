/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 不同颜色的点
 */
export default class PointRoundColorfull extends XThree.Sprite {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.material = new XThree.PointsNodeMaterial();
        this.material.sizeAttenuation = false;
        this.opacityNode              = tsl.shapeCircle();
        this.size                     = 10;
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setPointSize(size) {
        this.material.size = parseFloat(size);
    }

    /**
     * 
     * 设置点
     * 
     * @param {Array|Float32Array} points 
     * @param {Array|Float32Array} colors 
     * @param {*} copy 
     */
    setPoints(points, colors, copy = false) {
        if (!(points instanceof Float32Array)) {
            points = new Float32Array(points);
        } else if (copy) {
            points = points.slice();
        }

        if (!(colors instanceof Float32Array)) {
            colors = new Float32Array(colors);
        } else if (copy) {
            colors = colors.slice();
        }
        this.setPointsBuffer(points, colors, false);
    }

    /**
     * 
     * 设置点的Buffer
     * 
     * @param {Float32Array} points 
     * @param {Float32Array} colors 
     * @param {*} copy 
     */
    setPointsBuffer(points, colors, copy = false) {
        if (copy) {
            points = points.slice();
            colors = colors.slice();
        }
        const attri_0 = new XThree.InstancedBufferAttribute(points, 3);
        const attri_1 = new XThree.InstancedBufferAttribute(colors, 3);
        this.count = parseInt(points.length / 3);
        this.material.positionNode = tsl.instancedBufferAttribute(attri_0);
        this.material.colorNode    = tsl.instancedBufferAttribute(attri_1);
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
