/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';
import Base             from '../base';

/**
 * 参数
 */
const DEFAULT_COLOR = 0xFFFFFF;

/**
 * 线框
 */
export default class Wireframe extends Base {
    /**
     * 渲染工具
     */
    #line_segments = new XThreeRenderable.LineSegmentsImmediate();

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.add(this.#line_segments);
        this.#line_segments.setColor(DEFAULT_COLOR);
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Array|Float32Array} buffer 
     */
    setLinesBuffer(buffer) {
        this.#line_segments.setSegmentsBuffer(buffer);
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#line_segments.setColor(color);
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#line_segments.dispose();
    }
}