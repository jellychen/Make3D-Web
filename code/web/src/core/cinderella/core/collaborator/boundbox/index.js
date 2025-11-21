/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';
import Base             from '../base';

/**
 * 参数
 */
const DEFAULT_WIDTH = 1.5;
const DEFAULT_COLOR = 0xFFFFFF;

/**
 * 包围盒
 */
export default class BoundBox extends Base {
    /**
     * 渲染工具
     */
    #line_segments = new XThreeRenderable.LineSegments();

    /**
     * 数据
     */
    #min_x = -0.5;
    #min_y = -0.5;
    #min_z = -0.5;
    #max_x = +0.5;
    #max_y = +0.5;
    #max_z = +0.5;

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.add(this.#line_segments);
        this.#buildGeo();
        this.#line_segments.setWidth(DEFAULT_WIDTH);
        this.#line_segments.setColor(DEFAULT_COLOR);
    }

    /**
     * 
     * 设置Box
     * 
     * @param {*} box 
     */
    setBox(box) {
        if (!(box instanceof XThree.Box3)) {
            return;
        }

        this.#min_x = box.min.x;
        this.#min_y = box.min.y;
        this.#min_z = box.min.z;
        this.#max_x = box.max.x;
        this.#max_y = box.max.y;
        this.#max_z = box.max.z;

        this.#buildGeo();
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
        this.#line_segments.setResolution(renderer_pipeline.w, renderer_pipeline.h);
    }

    /**
     * 构建几何体
     */
    #buildGeo() {
        // 位置
        const x0 = this.#min_x;
        const y0 = this.#min_y;
        const z0 = this.#min_z;
        const x1 = this.#max_x;
        const y1 = this.#max_y;
        const z1 = this.#max_z;

        // 构建线
        const path = new XThreeRenderable.LinePath();
        path.moveTo(x0, y1, z1);
        path.lineTo(x1, y1, z1);
        path.lineTo(x1, y0, z1);
        path.lineTo(x0, y0, z1);
        path.lineTo(x0, y1, z1);

        path.moveTo(x0, y1, z0);
        path.lineTo(x1, y1, z0);
        path.lineTo(x1, y0, z0);
        path.lineTo(x0, y0, z0);
        path.lineTo(x0, y1, z0);

        path.moveTo(x0, y1, z1);
        path.lineTo(x1, y1, z1);
        path.lineTo(x1, y1, z0);
        path.lineTo(x0, y1, z0);
        path.lineTo(x0, y1, z1);

        path.moveTo(x1, y0, z1);
        path.lineTo(x1, y1, z1);
        path.lineTo(x1, y1, z0);
        path.lineTo(x1, y0, z0);
        path.lineTo(x1, y0, z1);

        path.moveTo(x0, y0, z1);
        path.lineTo(x1, y0, z1);
        path.lineTo(x1, y0, z0);
        path.lineTo(x0, y0, z0);
        path.lineTo(x0, y0, z1);

        path.moveTo(x0, y0, z1);
        path.lineTo(x0, y0, z0);
        path.lineTo(x0, y1, z0);
        path.lineTo(x0, y1, z1);
        path.lineTo(x0, y0, z1);

        this.#line_segments.setSegments(path.data);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#line_segments.dispose();
    }
}
