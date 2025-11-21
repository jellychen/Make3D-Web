/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';
import Base             from '../base';

/**
 * 参数
 */
const DEFAULT_WIDTH = 1;
const DEFAULT_COLOR = 0xFFFFFF;

/**
 * 线框
 */
export default class Wireframe extends Base {
    /**
     * 渲染工具
     */
    #line_segments = new XThreeRenderable.LineSegments();

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.add(this.#line_segments);
        this.#line_segments.setWidth(DEFAULT_WIDTH);
        this.#line_segments.setColor(DEFAULT_COLOR);
        this.#line_segments.setPolygonOffset(true, -2, -2);
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Array|Float32Array} buffer 
     */
    setLinesBuffer(buffer) {
        this.#line_segments.setSegments(buffer);
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
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameBegin(renderer_pipeline, renderer, camera) {
        super.onFrameBegin(renderer_pipeline, renderer, camera);
        const w = renderer_pipeline.w;
        const h = renderer_pipeline.h;
        this.#line_segments.setResolution(w, h);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#line_segments.dispose();
    }
}
