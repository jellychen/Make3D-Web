/* eslint-disable no-unused-vars */

import Timeline from './timeline';

/**
 * 常量
 */
const span_init_value = 100;
const span_min        = 60 ;
const span_max        = 300 ;
const offset_time_min = -0.2;

/**
 * 渲染器
 */
export default class Renderer {
    /**
     * 画布
     */
    #canvas;
    #dc;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w           = 0;
    #h           = 0;

    /**
     * 标尺
     */
    #timeline;

    /**
     * 渲染参数
     */
    #span        = span_init_value;
    #offset_time = offset_time_min;

    /**
     * 动画句柄
     */
    #animation_handle;

    /**
     * 获取
     */
    get pixel_ratio() {
        return this.#pixel_ratio;
    }

    /**
     * 获取
     */
    get w() {
        return this.#w;
    }

    /**
     * 获取
     */
    get h() {
        return this.#h;
    }

    /**
     * 获取
     */
    get timeline() {
        return this.#timeline;
    }

    /**
     * 获取
     */
    get offset_time() {
        return this.#offset_time;
    }

    /**
     * 获取一秒跨度
     */
    get span() {
        return this.#span;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     * @param {*} w 
     * @param {*} h 
     * @param {*} pixel_ratio 
     */
    constructor(canvas, w, h, pixel_ratio) {
        this.#canvas        = canvas;
        this.#pixel_ratio   = pixel_ratio;
        this.#w             = w;
        this.#h             = h;
        this.#canvas.width  = pixel_ratio * w;
        this.#canvas.height = pixel_ratio * h;
        this.#dc            = this.#canvas.getContext("2d");
        this.#dc.reset();
        this.#dc.scale(pixel_ratio, pixel_ratio);
        this.#timeline      = new Timeline(w, h);
    }

    /**
     * 
     * 重置尺寸
     * 
     * @param {*} pixel_ratio 
     * @param {*} w 
     * @param {*} h 
     */
    resize(pixel_ratio, w, h) {
        this.#pixel_ratio = pixel_ratio;
        this.#w           = w;
        this.#h           = h;
        this.#dc.reset();
        this.#dc.scale(pixel_ratio, pixel_ratio);
        this.#timeline.resize(w, h);
    }

    /**
     * 
     * 设置起始的时间
     * 
     * @param {*} time 
     */
    setOffsetTime(time) {
        if (time < offset_time_min) {
            this.#offset_time = offset_time_min;
        } else {
            this.#offset_time = time;
        }
    }

    /**
     * 
     * 缩放
     * 
     * @param {*} x 
     * @param {*} scale 
     */
    zoom(x, scale) {
        const t = x / this.#span + this.#offset_time;
        this.#span = this.#span * scale;
        if (this.#span < span_min) this.#span = span_min;
        if (this.#span > span_max) this.#span = span_max;
        this.#offset_time = t - x / this.#span;
        if (this.#offset_time < -0.2) {
            this.#offset_time = -0.2;
        }
        return this.#offset_time;
    }

    /**
     * 
     * 移动
     * 
     * @param {*} x0 
     * @param {*} x1 
     */
    offset(x0, x1) {
        const t0 = x0 / this.#span;
        const t1 = x1 / this.#span;
        this.#offset_time += t0 - t1;
        if (this.#offset_time < offset_time_min) {
            this.#offset_time = offset_time_min;
        }
    }

    /**
     * 开始绘制
     */
    #beginDraw() {
        this.#dc.clearRect(0, 0, this.#w, this.#h);
        this.#dc.save();
    }

    /**
     * 开始绘制
     */
    #draw() {
        const offset_time = this.#offset_time;
        const span        = this.#span;
        this.#timeline.draw(offset_time, span, this.#dc);
    }

    /**
     * 绘制结束
     */
    #endDraw() {
        this.#dc.restore();
    }

    /**
     * 
     * 执行绘制
     * 
     * @param {*} next_frame 
     */
    render(next_frame = true) {
        if (next_frame) {
            this.renderNextFrame();
        } else {
            this.#beginDraw();
            this.#draw();
            this.#endDraw();
        }
    }

    /**
     * 
     * 下一帧执行绘制
     * 
     * @returns 
     */
    renderNextFrame() {
        if (this.#animation_handle) {
            return;
        }

        this.#animation_handle = requestAnimationFrame(() => {
            this.#animation_handle = undefined;
            this.render(false);
        });
    }
}
