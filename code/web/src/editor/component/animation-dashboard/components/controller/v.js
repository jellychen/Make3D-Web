/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './v-btn-play';
import                            './v-range';
import                            './v-loop';
import                            './v-tween-selector';
import TweenSelectorPanel    from './v-tween-selector-panel';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-controller';

/**
 * 动画编辑器控制器
 */
export default class Controller extends Element {
    /**
     * 上下文
     */
    #context;
    
    /**
     * 元素
     */
    #btn_play;
    #btn_reset_to_front;
    #btn_add_marker;
    #btn_curve;
    #btn_ok;
    #range;
    #loop;

    /**
     * 是否播放中
     */
    #is_playing = false;

    /**
     * Curve
     */
    #curve_type = 'linear';

    /**
     * 获取曲线类型
     */
    get curve() {
        return this.#curve_type;
    }

    /**
     * 循环类型
     */
    get loop_type() {
        return this.#loop.type;
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
        this.#btn_play                   = this.getChild('#btn-play');
        this.#btn_reset_to_front         = this.getChild('#reset-to-front');
        this.#btn_add_marker             = this.getChild('#add-marker');
        this.#btn_curve                  = this.getChild('#curve');
        this.#btn_ok                     = this.getChild('#ok');
        this.#range                      = this.getChild('#range');
        this.#loop                       = this.getChild('#loop');
        this.#btn_play.onclick           = event => this.#onClickBtnPlay(event);
        this.#btn_reset_to_front.onclick = event => this.#onClickBtnResetToFront(event);
        this.#btn_add_marker.onclick     = event => this.#onClickBtnAddMarker(event);
        this.#btn_curve.onclick          = event => this.#onClickCurve(event);
        this.#btn_ok.onclick             = event => this.#onClickOk(event);
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
     * 设置播放模式
     * 
     * @param {*} set 
     */
    setPlayingMode(set) {
        if (set) {
            this.#is_playing = true;
            this.#btn_play.setStatus(true);
            this.#setElementEnable(this.#btn_reset_to_front, false);
            this.#setElementEnable(this.#btn_add_marker,     false);
            this.#setElementEnable(this.#btn_curve,          false);
            this.#setElementEnable(this.#btn_ok,             false);
            this.#setElementEnable(this.#range,              false);
            this.#setElementEnable(this.#loop,               false);
        } else {
            this.#is_playing = false;
            this.#btn_play.setStatus(false);
            this.#setElementEnable(this.#btn_reset_to_front, true );
            this.#setElementEnable(this.#btn_add_marker,     true );
            this.#setElementEnable(this.#btn_curve,          true );
            this.#setElementEnable(this.#btn_ok,             true );
            this.#setElementEnable(this.#range,              true );
            this.#setElementEnable(this.#loop,               true );
        }
    }

    /**
     * 
     * 设置区域
     * 
     * @param {*} start 
     * @param {*} end 
     */
    setRange(start, end) {
        this.#range.set(start, end);
    }

    /**
     * 
     * 设置元素可用性
     * 
     * @param {*} element 
     * @param {*} enable 
     */
    #setElementEnable(element, enable = true) {
        if (enable) {
            element.style.opacity = 1;
            element.style.pointerEvents = 'auto';
        } else {
            element.style.opacity = 0.2;
            element.style.pointerEvents = 'none';
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onClickBtnPlay(event) {
        this.#is_playing = !this.#is_playing;
        if (this.#is_playing) {
            this.#context.startAnimation();
            this.setPlayingMode(true);
        } else {
            this.#context.stopAnimation();
            this.setPlayingMode(false);
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onClickBtnResetToFront(event) {
        this.#context.resetToFront();
        this.#context.makeSureTimeVisible(0);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onClickBtnAddMarker(event) {
        const marker = this.#context.addNewMarkerAtCursorTime();
        if (!marker) {
            throw new Error("addNewMarkerAtCursorTime error");
        }
        this.#context.selectMarker(marker);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onClickCurve(event) {
        TweenSelectorPanel.Show(this.#btn_curve, type => {
            this.#curve_type = type;
            this.#btn_curve.setType(type);
        });
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onClickOk(event) {
        this.#context.close();
    }
}

CustomElementRegister(tagName, Controller);
