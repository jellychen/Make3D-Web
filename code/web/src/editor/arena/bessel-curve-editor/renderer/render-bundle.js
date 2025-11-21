/* eslint-disable no-undef */

import RenderPath from './render-path';

/**
 * 绘制
 */
export default class RenderBundle {
    /**
     * 几何数据
     */
    #path_curves;
    #path_curves_highlight;
    #path_curves_assist;
    #path_points;
    #path_points_highlight;

    /**
     * 获取
     */
    get curves() {
        return this.#path_curves;
    }

    /**
     * 获取
     */
    get curves_highlight() {
        return this.#path_curves_highlight;
    }

    /**
     * 获取
     */
    get curves_assist() {
        return this.#path_curves_assist;
    }

    /**
     * 获取
     */
    get points() {
        return this.#path_points;
    }

    /**
     * 获取
     */
    get points_highlight() {
        return this.#path_points_highlight;
    }

    /**
     * 构造函数
     */
    constructor() {
        this.#path_curves           = new RenderPath(true );
        this.#path_curves_highlight = new RenderPath(true );
        this.#path_curves_assist    = new RenderPath(true );
        this.#path_points           = new RenderPath(false);
        this.#path_points_highlight = new RenderPath(false);
    }

    /**
     * 重置
     */
    reset() {
        this.#path_curves          .reset();
        this.#path_curves_highlight.reset();
        this.#path_curves_assist   .reset();
        this.#path_points          .reset();
        this.#path_points_highlight.reset();
    }
}
