/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-bessel-curve-editor';

/**
 * 贝塞尔曲线，区域编辑器
 */
export default class BesselCurveEditor extends Element {
    /**
     * 元素
     */
    #container;
    #close;
    #content;
    #canvas;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 事件回调
     */
    #on_pointer_down   = event=> this.#onPointerDown(event);
    #on_pointer_move   = event=> this.#onPointerMove(event);
    #on_pointer_up     = event=> this.#onPointerUp(event);
    #on_pointer_cancel = event=> this.#onPointerCancel(event);

    /**
     * 鼠标是不是已经按下
     */
    #is_pointer_down = false;

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
        this.setEnableCustomizeMenu(true);
        this.#container = this.getChild('#container');
        this.#close     = this.getChild('#close');
        this.#content   = this.getChild('#content');
        this.#canvas    = this.getChild('#canvas');
        this.#close.onclick = event => this.dispose(event);

        // 监听事件
        this.#canvas.addEventListener('pointerdown',   this.#on_pointer_down);
        this.#canvas.addEventListener('pointermove',   this.#on_pointer_move);
        this.#canvas.addEventListener('pointerup',     this.#on_pointer_up);
        this.#canvas.addEventListener('pointercancel', this.#on_pointer_cancel);

        // 构建渲染器
        const w = this.#canvas.offsetWidth;
        const h = this.#canvas.offsetHeight;
        this.#renderer = new Renderer(this.#canvas);
        this.#renderer.resize(window.devicePixelRatio || 1, w, h);
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#is_pointer_down = true;
        this.setPointerCapture(event.pointerId);
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        console.log(event.offsetX, event.offsetY);
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#is_pointer_down = false;
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(
            this,
            {
                opacity: 0,
                duration: 300,
                easing: 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                }
            }
        );
    }
}

CustomElementRegister(tagName, BesselCurveEditor);
