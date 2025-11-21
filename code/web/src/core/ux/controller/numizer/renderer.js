/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isNumber from 'lodash/isNumber';

/**
 * 绘制标准
 */
const _cursor_w     = 6;
const _cursor_h     = 2;
const _cursor_color = 'rgba(255, 255, 255, 255)';
const _ruler_color  = 'rgba(120, 120, 120, 255)';
const _ruler_big    = 0.50;
const _ruler_small  = 0.20;

/**
 * 绘制
 */
export default class Renderer {
    /**
     * 宿主
     */
    #host;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 跨度/单跨度细分
     */
    #span = 3;                  // 细分几个跨度
    #one_span_subdivide = 5;    // 单个跨度细分成几个分量

    /**
     * 绘制相关的参数
     */
    #cursor_color = _cursor_color;
    #ruler_color  = _ruler_color;

    /**
     * 渲染的上下文
     */
    #dc = undefined;

    /**
     * 游标处的数值
     */
    #value = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} dc 
     */
    constructor(host, dc) {
        this.#host = host;
        this.#dc   = dc;
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
        this.#dc.reset();
        this.#dc.scale(pixel_ratio, pixel_ratio);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getValue() {
        return this.#value;
    }

    /**
     * 
     * 设置游标指示的数值
     * 
     * @param {Number} value 
     */
    setValue(value) {
        if (isNumber(value)) {
            if (this.#value !== value) {
                this.#value = value;
                this.#requestAnimationFrame();
            }
        }
    }

    /**
     * 
     * 调整值
     * 
     * @param {Number} value 
     */
    offsetValue(value) {
        if (isNumber(value)) {
            if (0 !== value) {
                this.#value += value;
                this.#requestAnimationFrame();
            }
        }
    }

    /**
     * 
     * 获取跨度
     * 
     * @returns 
     */
    getSpan() {
        return this.#span;
    }

    /**
     * 
     * 设置跨度
     * 
     * @param {Number} value 
     */
    setSpan(value) {
        if (isNumber(value)) {
            if (this.#span !== value) {
                this.#span = value;
                this.#requestAnimationFrame();
            }
        }
    }

    /**
     * 
     * 设置单跨度细分次数
     * 
     * @param {Number} subdivide 
     */
    setOneSpanSubdivide(subdivide) {
        if (isNumber(subdivide)) {
            if (this.#one_span_subdivide !== subdivide) {
                this.#one_span_subdivide = subdivide;
                this.#requestAnimationFrame();
            }
        }
    }

    /**
     * 
     * 设置游标的颜色
     * 
     * @param {string} color 
     */
    setCursorColor(color) {
        this.#cursor_color = color;
        this.#requestAnimationFrame();
    }

    /**
     * 
     * 设置标尺的颜色
     * 
     * @param {*} color 
     */
    setRulerColor(color) {
        this.#ruler_color = color;
        this.#requestAnimationFrame();
    }

    /**
     * 执行渲染
     */
    draw() {
        if (this.#w <= 0 || this.#h <= 0) {
            return;
        }
        this.#dc.clearRect(0, 0, this.#w, this.#h);
        this.#drawRuler();
        this.#drawCursor();
    }

    /**
     * 
     * 计算一个span细分刻度的像素占用
     * 
     * @param {Number} span 
     * @param {Number} one_span_subdivide 
     * @returns 
     */
    clacOneSpanSubdividePixel(span = 10, one_span_subdivide = 10) {
        return this.#w / (this.#span * this.#one_span_subdivide);
    }

    /**
     * 绘制游标
     */
    #drawCursor() {
        const w = _cursor_w;
        const h = _cursor_h;
        const half_w = w / 2;
        let x0 = this.#w / 2 - half_w;
        let x1 = this.#w / 2 + half_w;

        // 绘制上下2个三角形
        this.#dc.beginPath();
        this.#dc.moveTo(x0, 0);
        this.#dc.lineTo(this.#w / 2, h);
        this.#dc.lineTo(x1, 0);
        this.#dc.closePath();
        this.#dc.moveTo(x0, this.#h);
        this.#dc.lineTo(this.#w / 2, this.#h - h);
        this.#dc.lineTo(x1, this.#h);
        this.#dc.closePath();
        this.#dc.fillStyle = this.#cursor_color;
        this.#dc.fill();

        // 绘制轴线
        this.#dc.beginPath();
        this.#dc.moveTo(this.#w / 2, 0);
        this.#dc.lineTo(this.#w / 2, this.#h);
        this.#dc.closePath();
        this.#dc.lineWidth = 1;
        this.#dc.strokeStyle = this.#cursor_color;
        this.#dc.stroke();
    }

    /**
     * 绘制标尺
     */
    #drawRuler() {
        // 计算每个跨度细分占用的像素
        let p = this.clacOneSpanSubdividePixel(this.#span, this.#one_span_subdivide);
        let s = 1.0 / this.#one_span_subdivide;

        // 计算图形的位置
        let start = this.#value - this.#span / 2.0;
        let start_begin = Math.ceil(start / s) * s;
        let start_pixel = (start_begin - start) * p * this.#one_span_subdivide;

        // 绘制图形
        this.#dc.beginPath();

        // 计算刻度的长度
        let ruler_big       = (this.#h * _ruler_big);
        let ruler_big_top   = (this.#h - ruler_big) / 2.0;
        let ruler_small     = (this.#h * _ruler_small);
        let ruler_small_top = (this.#h - ruler_small) / 2.0;

        // 绘制刻度尺
        let current_value = start_begin;
        let current = start_pixel;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (current > this.#w) {
                break;
            }

            let demarcation = Math.abs(Math.round(current_value) - current_value) <= 0.0001;
            if (demarcation) {
                this.#dc.moveTo(current, ruler_big_top);
                this.#dc.lineTo(current, ruler_big + ruler_big_top);
            } else {
                this.#dc.moveTo(current, ruler_small_top);
                this.#dc.lineTo(current, ruler_small + ruler_small_top);
            }

            current += p;
            current_value += s;
        }

        // 绘制
        this.#dc.strokeStyle = this.#ruler_color;
        this.#dc.lineWidth = 1;
        this.#dc.stroke();
    }

    /**
     * 请求下一帧渲染
     */
    #requestAnimationFrame() {
        if (this.#w <= 0 || this.#h <= 0) {
            return;
        }
        this.#host.requestAnimationFrame();
    }
}
