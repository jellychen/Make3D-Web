/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Colosseum             from './ele';
import Renderer              from './renderer';
import Cursor                from './v-cursor';
import Html                  from './v-tpl.html';
import Hcss                  from "./v-tpl.html.css";
const tpl = ElementDomCreator.createTpl(Html, Hcss);
const tagName = 'x-biz-tube-section-editor';

/**
 * 曲线编辑器
 */
export default class CurveEditor extends Element {
    /**
     * 事件
     */
    onchanged;
    
    /**
     * 元素
     */
    #container;
    #canvas;
    #oper_selector;
    #reset;

    /**
     * 监控尺寸
     */
    #canvas_resize_observer;

    /**
     * 渲染器
     */
    #renderer;
    #animation_frame_handle;

    /**
     * 舞台
     */
    #colosseum;

    /**
     * 鼠标样式设置
     */
    #cursor_setter;

    /**
     * 获取点
     */
    get points() {
        return this.#colosseum.curve.points;
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
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container                     = this.getChild('#container');
        this.#canvas                        = this.getChild('#canvas');
        this.#oper_selector                 = this.getChild('#oper-selector');
        this.#reset                         = this.getChild('#reset');
        this.#reset.onclick                 = event => this.reset(event);
        this.#oper_selector.on_data_changed = oper => this.#onOperSelectorChanged(oper);
        this.#cursor_setter                 = new Cursor(this.#canvas);
        this.#canvas.setCursor              = type => this.#cursor_setter.setCursor(type);
        this.#renderer                      = new Renderer(this.#canvas);
        this.#colosseum                     = new Colosseum(this, this.#canvas);

        this.setCursor('pointer');
    }

    /**
     * 挂接到DOM上的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize()
        });
        this.#canvas_resize_observer.observe(this.#container);
    }

    /**
     * 从DOM上摘除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (undefined != this.#canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.#canvas);
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
        this.render();
    }

    /**
     * 
     * 交互操作修改
     * 
     * @param {*} oper 
     */
    #onOperSelectorChanged(oper) {
        this.#colosseum.oper = oper;
        switch (oper) {
        case 'select-point':
            this.setCursor('pointer');
            break;

        case 'select-curve':
        case 'subdivision':
            this.setCursor('curve');
            break;

        case 'delete-curve':
            this.setCursor('scissor');
            break;
        }
    }

    /**
     * 
     * 设置鼠标样式
     * 
     * @param {*} type 
     */
    setCursor(type) {
        this.#cursor_setter.setCursor(type);
    }

    /**
     * 曲线重置
     */
    reset() {
        this.#colosseum.curveReset();
    }

    /**
     * 
     * 显示
     * 
     * @param {*} token 
     * @param {*} defer_close 
     */
    showAlert(token, defer_close = 1200) {
    }

    /**
     * 执行渲染
     */
    render() {
        if (!isUndefined(this.#animation_frame_handle)) {
            cancelAnimationFrame(this.#animation_frame_handle);
            this.#animation_frame_handle = undefined;
        }
        
        this.#renderer.beginRender();
        this.#colosseum.draw(this.#renderer);
        this.#renderer.endRender();
    }

    /**
     * 下一帧执行渲染
     */
    renderNextframe() {
        if (!isUndefined(this.#animation_frame_handle)) {
            ;
        } else {
            this.#animation_frame_handle = requestAnimationFrame(() => {
                this.#animation_frame_handle = undefined;
                this.render()
            });
        }
    }
}

CustomElementRegister(tagName, CurveEditor);
