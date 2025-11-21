/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree       from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2';

/**
 * 绘制多条线段，采用虚线的方式进行
 */
export default class LineSegmentsDash extends LineSegments2 {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.material.color        = new XThree.Color(0xFFFFFF);
        this.material.linewidth    = 1;
        this.material.vertexColors = false;
        this.material.dashed       = true;
        this.material.scale        = 2;
        this.material.dashSize     = 1;
        this.material.gapSize      = 1;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.color = new XThree.Color(color);
        return this;
    }

    /**
     * 
     * 设置渲染的宽度
     * 
     * @param {*} width 
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
     */
    setResolution(width, height) {
        this.material.resolution.set(width, height);
        return this;
    }

    /**
     * 
     * [0.5, 3] 之间
     * 
     * @param {Number} scale 
     */
    setDashScale(scale) {
        this.material.scale = scale;
        return this;
    }

    /**
     * 
     * 设置虚线的参数
     * 
     * @param {Number} dash_size 
     * @param {Number} gap_size 
     */
    setDash(dash_size, gap_size) {
        this.material.dashSize = dash_size;
        this.material.gapSize  = gap_size;
        return this;
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {*} points 
     */
    setSegments(points) {
        this.geometry.setPositions(points);
        this.computeLineDistances();
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
