/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './v-timer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-cursor';

/**
 * 时间轴的游标
 */
export default class Cursor extends Element {
    /**
     * 上下文
     */
    #context;

    /**
     * 元素
     */
    #cursor;
    #timer;

    /**
     * 步长
     */
    #span;
    #offset_time;

    /**
     * 当前的时间
     */
    #time = 0;

    /**
     * 事件记录
     */
    #pointer_down_time;
    #pointer_down_x;

    /**
     * 获取时间
     */
    get time() {
        return this.#time;
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#cursor = this.getChild("#cursor");
        this.#timer  = this.getChild("#timer");
        this.#cursor.onpointerdown = event => this.#onPointerDown(event);
    }

    /**
     * 
     * 设置上下文
     * 
     * @param {*} context 
     */
    setContext(context) {
        this.#context = context;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} span 
     * @param {*} offset_time 
     */
    setSpanAndOffsetTime(span, offset_time) {
        this.#offset_time = offset_time;
        this.#span        = span;
        this.update();
    }

    /**
     * 
     * 获取当前可能存在的位置
     * 
     * @returns 
     */
    getPosition() {
        const offset_time = this.#offset_time;
        const span        = this.#span;
        return (this.#time - offset_time) * span;
    }

    /**
     * 更新
     */
    update() {
        this.style.left = `${this.getPosition()}px`;
    }

    /**
     * 
     * 设置当前的位置
     * 
     * @param {*} time 
     * @param {*} update_position 
     * @returns 
     */
    setTime(time, update_position = true) {
        if (time <= 0) {
            time = 0;
        }

        if (this.#time == time) {
            return;
        }

        this.#time = time;
        this.#timer.setTime(time);
        if (update_position) {
            this.update();
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#pointer_down_time = this.#time;
        this.#pointer_down_x = event.clientX;
        this.#cursor.setPointerCapture(event.pointerId);
        this.#cursor.onpointermove   = event => this.#onPointerMove(event);
        this.#cursor.onpointerup     = event => this.#onPointerUp(event);
        this.#cursor.onpointercancel = event => this.#onPointerCancel(event);
        if (this.#context) {
            this.#context.selectMarker(undefined);
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        const rect = this.#context.getBoundingClientRect();
        const x = event.clientX;
        if (x <= rect.left) {
            const zero_time_x = (0.0 - this.#offset_time) * this.#span
            this.style.left = `${Math.max(zero_time_x, 10)}px`;
        } else if (x >= rect.right) {
            this.style.left = `${rect.width - 10}px`;
        } else {
            const t = (x - this.#pointer_down_x) / this.#span + this.#pointer_down_time;
            this.setTime(t, true);
            this.#context.makeSureTimeVisible(t, 0);
            this.#context.updateAnimationAtTime(t);
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#cursor.releasePointerCapture(event.pointerId);
        this.#cursor.onpointermove   = undefined;
        this.#cursor.onpointerup     = undefined;
        this.#cursor.onpointercancel = undefined;
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
}

CustomElementRegister(tagName, Cursor);
