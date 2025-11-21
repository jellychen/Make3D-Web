/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-preview';

/**
 * 预览
 */
export default class Preview extends Element {
    /**
     * 元素
     */
    #container;
    #canvas;
    #canvas_resize_observer;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 渲染的场景
     */
    #scene;

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 获取
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 获取
     */
    get renderer() {
        return this.#renderer;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#canvas    = this.getChild('#canvas');
        this.#renderer  = new Renderer(this.#canvas);
    }

    /**
     * 
     * 设置新的渲染元素
     * 
     * @param {*} scene 
     */
    setScene(scene) {
        this.#scene = scene;
        this.#renderer.setScene(scene);
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        this.#canvas_resize_observer = new ResizeObserver(entries => this.#onResize());
        this.#canvas_resize_observer.observe(this.#canvas);
        this.#renderer.renderNextFrame();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (undefined != this.canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.canvas);
            this.#canvas_resize_observer.disconnect();
            this.#canvas_resize_observer = undefined;
        }
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.#canvas.offsetWidth;
        const h = this.#canvas.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#renderer.resize(ratio, w, h);
    }
}

CustomElementRegister(tagName, Preview);