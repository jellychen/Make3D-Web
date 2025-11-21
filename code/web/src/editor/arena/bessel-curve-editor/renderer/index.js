/* eslint-disable no-undef */

import RenderBundle from './render-bundle';

/**
 * 绘制
 */
export default class Renderer {
    /**
     * 绘制接口
     */
    #canvas;
    #canvas_context;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#canvas_context = this.#canvas.getContext("2d");
    }

    /**
     * 
     * 尺寸发生了变化
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w = width;
        this.#h = height;
        this.#canvas_context.reset();
        this.#canvas_context.scale(pixel_ratio, pixel_ratio);
    }

    /**
     * 清空屏幕
     */
    clear() {
        if (this.#w <= 0 || this.#h <= 0) {
            return;
        }
        this.#canvas_context.clearRect(0, 0, this.#w, this.#h);
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} render_bundle 
     */
    draw(render_bundle) {

    }

    // /**
    //  * 
    //  * 绘制点
    //  * 
    //  * @param {*} points 
    //  * @param {*} r 
    //  * @param {*} color 
    //  * @param {*} outline_color 
    //  */
    // drawPoints(points, r, color, outline_color) {
    //     const ctx = this.#canvas_context;
    //     ctx.beginPath();
    //     for (const point of points) {
    //         const x = point.x;
    //         const y = point.y;
    //         ctx.roundRect(x - r, y - r, 2 * r, 2 * r, r);
    //     }
    //     ctx.closePath();

    //     ctx.fillStyle = color;
    //     ctx.strokeStyle = outline_color;
    //     ctx.lineWidth = 1;
    //     ctx.fill();
    //     ctx.stroke();
    // }

    // /**
    //  * 
    //  * 绘制曲线
    //  * 
    //  * @param {*} curves 
    //  * @param {*} color 
    //  * @param {*} line_width 
    //  * @param {*} dash 
    //  */
    // drawCurves(curves, color, line_width, dash = false) {
    //     const ctx = this.#canvas_context;
        
    // }
}
