/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree              from 'three/webgpu';
import { LineSegments2 }        from 'three/addons/lines/webgpu/LineSegments2';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry';

/**
 * 绘制多条线段，每条颜色可以不一样
 */
export default class LineSegmentsColor extends LineSegments2 {
    /**
     * 构造函数
     */
    constructor() {
        super(new LineSegmentsGeometry(), new XThree.Line2NodeMaterial({
            color       : 0xFFFFFF,
            vertexColors: true,
            linewidth   : 1,
            dashed      : false,
        }));
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
     * 材质设置分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    setResolution(width, height) {
        if (this.material.resolution) {
            this.material.resolution.set(width, height);
        }
        return this;
    }

    /**
     * 
     * 设置线段的点和颜色
     * 
     * @param {Number} points 
     * @param {Number} colors 
     */
    setSegments(points, colors) {
        this.geometry.dispose();
        this.geometry = new LineSegmentsGeometry();
        this.geometry.setPositions(points);
        this.geometry.setColors(colors);
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
