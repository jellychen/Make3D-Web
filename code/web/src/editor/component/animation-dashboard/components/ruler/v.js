/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-ruler';

/**
 * 时间轴的标尺
 */
export default class Ruler extends Element {
    /**
     * 元素
     */
    #canvas;
    #canvas_resize_observer;

    /**
     * 判断是不是按下
     */
    #pointer_down   = false;
    #pointer_down_x = 0;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 事件发生了变化
     */
    onSpanChanged;
    onOffsetTimeChnaged;
    onChanged;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#canvas = this.getChild('#canvas');
        this.#canvas.onpointerdown   = event => this.#onPointerDown  (event);
        this.#canvas.onpointermove   = event => this.#onPointerMove  (event);
        this.#canvas.onpointerup     = event => this.#onPointerUp    (event);
        this.#canvas.onpointercancel = event => this.#onPointerCancel(event);
        this.#canvas.onwheel         = event => this.#onWheel        (event);
        
        const w = this.#canvas.offsetWidth;
        const h = this.#canvas.offsetHeight;
        const r = window.devicePixelRatio || 1;
        this.#renderer = new Renderer(this.#canvas, w, h, r);
    }

    /**
     * 
     * 获取offset
     * 
     * @returns 
     */
    getOffsetTime() {
        return this.#renderer.offset_time;
    }

    /**
     * 
     * 获取一秒跨度
     * 
     * @returns 
     */
    getSpan() {
        return this.#renderer.span;
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize();
        });
        this.#canvas_resize_observer.observe(this.#canvas);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.#canvas);
            this.#canvas_resize_observer.disconnect();
            this.#canvas_resize_observer = undefined;
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        this.#pointer_down = true;
        this.#pointer_down_x = event.offsetX;
        this.#canvas.setPointerCapture(event.pointerId);
        this.#canvas.style.cursor = "grabbing";
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (!this.#pointer_down) {
            return;
        }
        const x = event.offsetX;
        this.#renderer.offset(this.#pointer_down_x, x);
        this.#renderer.render();
        this.#pointer_down_x = x;

        if (isFunction(this.onOffsetTimeChnaged)) {
            try {
                this.onSpanChanged(this.getOffsetTime());
            } catch (e) {
                console.error(e);
            }
        }

        if (isFunction(this.onChanged)) {
            try {
                this.onChanged(this.getSpan(), this.getOffsetTime());
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#pointer_down = false;
        this.#canvas.releasePointerCapture(event.pointerId);
        this.#canvas.style.cursor = "grab";
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 
     * 滚轮
     * 
     * @param {*} event 
     */
    #onWheel(event) {
        event.preventDefault();
        if (event.deltaY > 0) {
            this.#renderer.zoom(event.offsetX, 1.1);
            this.#renderer.render();
        } else {
            this.#renderer.zoom(event.offsetX, 0.9);
            this.#renderer.render();
        }

        if (isFunction(this.onSpanChanged)) {
            try {
                this.onSpanChanged(this.getSpan());
            } catch (e) {
                console.error(e);
            }
        }

        if (isFunction(this.onChanged)) {
            try {
                this.onChanged(this.getSpan(), this.getOffsetTime());
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w     = this.#canvas.offsetWidth;
        const h     = this.#canvas.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#renderer.resize(ratio, w, h);
        this.#renderer.render(false);
    }

    /**
     * 
     * 确保时间出于可见的范围
     * 
     * @param {*} time 
     * @param {*} limit 
     * @returns 
     */
    makeSureTimeVisible(time, limit = 0) {
        const offset_time = this.getOffsetTime();
        const span        = this.getSpan();
        const position    = (time - offset_time) * span;

        let need_change_offset_time = false;
        let new_offset_time;
        if (position < limit) {
            new_offset_time = time - limit / span;
            need_change_offset_time = true;
        }
        
        const limit_r = this.#canvas.offsetWidth - limit;
        if (position > limit_r) {
            new_offset_time = time - limit_r / span;
            need_change_offset_time = true;
        }

        if (!need_change_offset_time) {
            return;
        } else {
            this.#renderer.setOffsetTime(new_offset_time);
        }

        this.#renderer.render();

        if (isFunction(this.onOffsetTimeChnaged)) {
            try {
                this.onSpanChanged(this.getOffsetTime());
            } catch (e) {
                console.error(e);
            }
        }

        if (isFunction(this.onChanged)) {
            try {
                this.onChanged(this.getSpan(), this.getOffsetTime());
            } catch (e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, Ruler);
