/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Moveable              from '@common/misc/moveable';
import Renderer              from './renderer';
import FrameRateStatistics   from './frame-rate-statistics';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-performance';

/**
 * 帧率统计, 统计8帧的平均值，用来绘制性能图谱
 */
const frame_count          = 8;
const frame_segments_count = 8;

/**
 * 性能
 */
export default class Performance extends Element {
    /**
     * 元素
     */
    #container;
    #fps_value;
    #chart_canvas;

    /**
     * 回调句柄
     */
    #on_frame_callback = () => this.#onFrameCallback();
    #frame_callback_handle;

    /**
     * 上一次回调的时间
     */
    #last_frame_time = -1;

    /**
     * FPS的统计
     */
    #frame_rate_statistics = new FrameRateStatistics();
    #frame_segment_count   = 0;
    
    /**
     * charts 渲染器
     */
    #renderer;

    /**
     * 可移动
     */
    #moveable;
    
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建函数
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#fps_value = this.getChild('#fps-value');
        this.#chart_canvas = this.getChild('#chart');
        this.#renderer = new Renderer(this.#chart_canvas);
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        this.#moveable = new Moveable(this.#container, this.parentNode);
        this.#moveable.attach();
        this.#frame_callback_handle = requestAnimationFrame(this.#on_frame_callback);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#frame_callback_handle) {
            cancelAnimationFrame(this.#frame_callback_handle);
            this.#frame_callback_handle = undefined;
        }
        this.#moveable.detach();
    }

    /**
     * 
     * 显示FPS
     * 
     * @param {Number} fps 
     */
    #showFPS(fps) {
        if (fps < 14) {
            this.#fps_value.setAttribute('type', 'warn');
        } else {
            this.#fps_value.setAttribute('type', 'info');
        }
        this.#fps_value.innerText = fps.toFixed(2);
    }

    /**
     * 帧回调
     */
    #onFrameCallback() {
        this.#frame_callback_handle = requestAnimationFrame(this.#on_frame_callback);

        // 计算FPS
        let now = performance.now();
        if (this.#last_frame_time >= 0) {

            // 插入 FPS
            let fps = 1000.0 / (now - this.#last_frame_time);
            this.#frame_rate_statistics.push(fps);
            if (this.#frame_rate_statistics.count() > frame_count) {
                this.#frame_rate_statistics.popOldest();
            }

            // 配合统计
            this.#frame_segment_count++;
            if (this.#frame_segment_count >= frame_segments_count) {
                let mean_fps = this.#frame_rate_statistics.mean();
                this.#renderer.push(mean_fps);
                this.#showFPS(mean_fps);
                this.#frame_segment_count = 0;
            }
        }

        // 重置帧时间
        this.#last_frame_time = now;
    }
}

CustomElementRegister(tagName, Performance);
