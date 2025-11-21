/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import RendererView          from './renderer/v';
import Toolbar               from './toolbar/v';
import Tips                  from './v-tips';
import ShowSetter            from './setter';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard';

/**
 * 默认
 */
const DEFAULT_SIZE_W = 600;
const DEFAULT_SIZE_H = 400;

/**
 * 渲染
 */
export default class RtRendererDashboard extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 历史记录
     */
    #historical_recorder;

    /**
     * toolbar
     */
    #toolbar;

    /**
     * 渲染核心
     */
    #renderer_view;

    /**
     * 设置器
     */
    #setter;

    /**
     * 元素
     */
    #container;
    #board;
    #board_size_w = DEFAULT_SIZE_W;
    #board_size_h = DEFAULT_SIZE_H;
    #tips;

    /**
     * 尺寸发生变化
     */
    #resize_observer;

    /**
     * 事件
     */
    ondismiss;

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 获取
     */
    get renderer_view() {
        return this.#renderer_view;
    }

    /**
     * 获取
     */
    get toolbar() {
        return this.#toolbar;
    }

    /**
     * 构造函数
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator         = coordinator;
        this.#historical_recorder = coordinator.getHistoricalRecorder();
        this.#renderer_view       = new RendererView(this.#coordinator);
        this.createContentFromTpl(tpl);
        this.setBoardSize(DEFAULT_SIZE_W, DEFAULT_SIZE_H);
        this.#board.appendChild(this.#renderer_view);
        this.#setter = ShowSetter(coordinator, this.#renderer_view, this);
        this.#toolbar = new Toolbar(this.#renderer_view, this, coordinator);
        this.#renderer_view.addEventListener('load-pipeline-success', () => this.#loadPipelineSuccess());
        this.#renderer_view.addEventListener('render-frame',          () => this.#onFrame());
        this.#renderer_view.addEventListener('tips',                  event => this.#onRecvTips(event));
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#board     = this.getChild('#board');
        this.#tips      = this.getChild('#tips');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#resize_observer = new ResizeObserver(entries => {
            this.#onResize();
        });
        this.#resize_observer.observe(this.#container);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#resize_observer) {
            this.#resize_observer.unobserve(this);
            this.#resize_observer.disconnect();
            this.#resize_observer = undefined;
        }
    }

    /**
     * 
     * 设置渲染的像素尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     */
    setRenderSize(w, h) {
        const dpr = window.devicePixelRatio || 1.0;
        w = w / dpr;
        h = h / dpr;
        this.setBoardSize(w, h);
    }

    /**
     * 
     * 设置Board尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     */
    setBoardSize(w, h) {
        this.#board_size_w = w;
        this.#board_size_h = h;
        this.#board.style.width  = `${w}px`;
        this.#board.style.height = `${h}px`;
        this.adjustBoardScaleToEnsureCanbeSeen();
    }

    /**
     * 
     * 设置tips
     * 
     * @param {*} text 
     */
    setTips(text) {
        this.#tips.setText(text);
    }

    /**
     * 调整board确保可以被看到
     */
    adjustBoardScaleToEnsureCanbeSeen() {
        const w  = this.#container.clientWidth;
        const h  = this.#container.clientHeight;
        const w0 = w - 32;
        const h0 = h - 32;
        const w1 = this.#board_size_w;
        const h1 = this.#board_size_h;
        const p0 = Math.min(w0 / w1, 1.0);
        const p1 = Math.min(h0 / h1, 1.0);
        const ss = Math.min(p0, p1);
        this.#board.style.transform = `scale(${ss},${ss})`;
    }

    /**
     * 销毁
     */
    dismiss() {
        if (this.#setter) {
            this.#setter.dismiss();
            this.#setter = undefined;
        }
        
        this.remove();

        if (isFunction(this.ondismiss)) {
            this.ondismiss();
        }
    }

    /**
     * 渲染管线加载完成
     */
    #loadPipelineSuccess() {
        this.#setter.onConstructFinish();
        this.#toolbar.showMask(false);
    }

    /**
     * 尺寸发生了变化
     */
    #onResize() {
        this.adjustBoardScaleToEnsureCanbeSeen();
    }

    /**
     * 渲染完成一帧
     */
    #onFrame() {
        const target  = this.#renderer_view.sample_count;
        const current = this.#renderer_view.current_sample_count;
        this.#toolbar.setSampleCount(target, current);
    }

    /**
     * 
     * 接收
     * 
     * @param {*} event 
     */
    #onRecvTips(event) {
        this.setTips(event.tips);
    }
}

CustomElementRegister(tagName, RtRendererDashboard);
