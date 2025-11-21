/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree              from 'three/webgpu';
import { LineSegments2 }        from 'three/addons/lines/webgpu/LineSegments2';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry';

/**
 * 绘制多条线段
 */
export default class LineSegments extends LineSegments2 {
    /**
     * 构造函数
     */
    constructor() {
        super(new LineSegmentsGeometry(), new XThree.Line2NodeMaterial({
            transparent : true,
            color       : 0xFFFFFF,
            vertexColors: false,
            linewidth   : 1,
            dashed      : false,
        }));
    }

    /**
     * 
     * 设置
     * 
     * @param {Boolean} enable 
     * @param {Number} factor 
     * @param {Number} units 
     */
    setPolygonOffset(enable, factor, units = 1) {
        this.material.polygonOffset = true == enable;
        this.material.polygonOffsetFactor = parseFloat(factor);
        this.material.polygonOffsetUnits  = parseFloat(units);
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
     * 设置渲染的宽度
     * 
     * @param {Number} width 
     */
    setWidth(width) {
        this.material.linewidth = width;
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
     * 材质设置分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} needsUpdate 
     * @returns 
     */
    setResolution(width, height, needsUpdate = false) {
        if (this.material.resolution) {
            this.material.resolution.set(width, height);
            this.material.needsUpdate = needsUpdate;
        }
        return this;
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Array|Float32Array} points 
     */
    setSegments(points) {
        this.geometry.dispose();
        this.geometry = new LineSegmentsGeometry();
        this.geometry.setPositions(points);
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
