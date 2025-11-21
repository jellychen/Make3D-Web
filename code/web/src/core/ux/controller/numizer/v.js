/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isNumber              from 'lodash/isNumber';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
import Renderer              from './renderer';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-numizer';

/**
 * 数值
 */
export default class Numizer extends Element {
    /**
     * Dom元素
     */
    #container;
    #canvas;
    #canvas_resize_observer;

    /**
     * 渲染流程
     */
    #renderer_first_resize = true;
    #is_waitting_render = false;
    #renderer_request_animation_frame_id;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 绘制流程
     */
    #dc;

    /**
     * 监听的事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;

    /**
     * 值缩放
     */
    #value_scale = 1.0;

    /**
     * 记录
     */
    #last_pointer_x;

    /**
     * 正在设置
     */
    #is_setting = false;

    /**
     * 回调函数
     */
    on_value_changed;

    /**
     * 整数
     */
    #integer = false;

    /**
     * 获取
     */
    get value() {
        return this.getValue();
    }

    /**
     * 设置
     */
    set value(data) {
        this.setValue(data);
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
        this.#container = this.getChild('#container');
        this.#canvas = this.getChild('#canvas');
        this.#dc = this.#canvas.getContext("2d");
        this.#renderer = new Renderer(this, this.#dc);

        // 事件的回调
        this.#on_pointer_down   = event=> this.#onPointerDown(event);
        this.#on_pointer_move   = event=> this.#onPointerMove(event);
        this.#on_pointer_up     = event=> this.#onPointerUp(event);
        this.#on_pointer_cancel = event=> this.#onPointerCancel(event);
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "integer", 
                "scale",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性设置
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('integer' == name) {
            this.#integer = 'true' == _new;
        } else if ('scale' == name) {
            this.#value_scale = parseFloat(_new);
        }
    }

    /**
     * 
     * 强制使用整数
     * 
     * @param {*} force 
     */
    setForceInteger(force) {
        this.#integer = force; 
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize()
        });
        this.#canvas_resize_observer.observe(this.#canvas);
        this.addEventListener('pointerdown', this.#on_pointer_down);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (undefined != this.#canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.#canvas);
            this.#canvas_resize_observer.disconnect();
            this.#canvas_resize_observer = undefined;
        }
        this.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.removeEventListener('pointermove',   this.#on_pointer_move);
        this.removeEventListener('pointerup',     this.#on_pointer_up);
        this.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 设置显示的跨度
     * 
     * @param {Number} value 
     */
    setSpan(value) {
        if (isNumber(value)) {
            this.#is_setting = true;
            this.#renderer.setSpan(value);
            this.#is_setting = false;
        }
    }

    /**
     * 
     * 设置单个跨度的细分次数
     * 
     * @param {Number} subdivide 
     */
    setOneSpanSubdivide(subdivide) {
        if (isNumber(subdivide)) {
            this.#is_setting = true;
            this.#renderer.setOneSpanSubdivide(subdivide);
            this.#is_setting = false;
        }
    }

    /**
     * 
     * 获取缩放因子
     * 
     * @returns 
     */
    getValueScale() {
        return this.#value_scale;
    }

    /**
     * 
     * 设置缩放因子
     * 
     * @param {*} scale 
     */
    setValueScale(scale = 1.0) {
        this.#value_scale = parseFloat(scale);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getValue() {
        const value = this.#renderer.getValue() * this.#value_scale;
        if (this.#integer) {
            return parseInt(value);
        } else {
            return value;
        }
    }

    /**
     * 
     * 设置显示的值
     * 
     * @param {Number} value 
     */
    setValue(value) {
        if (!isNumber(value)) {
            return;
        }

        value /= this.#value_scale;

        if (this.#integer) {
            value = parseInt(value);
        }

        if (this.#renderer.getValue() == value) {
            return;
        }

        this.#is_setting = true;
        this.#renderer.setValue(value);
        this.#is_setting = false;
    } 

    /**
     * 
     * 修改鼠标样式
     * 
     * @param {Boolean} grab 
     */
    #setCursorGrab(grab) {
        if (true === grab) {
            this.style.cursor = 'grabbing';
        } else {
            this.style.cursor = 'grab';
        }
    }

    /**
     * 执行渲染
     */
    #onRender() {
        this.#renderer.draw();
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.#container.offsetWidth;
        const h = this.#container.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#canvas.style.width  = `${w}px`;
        this.#canvas.style.height = `${h}px`;
        this.#renderer.resize(ratio, w, h);

        /**
         * 如果首次执行resize，延迟到下一帧执行
         */
        if (!this.#renderer_first_resize) {
            this.immediateRender();
        } else {
            this.#renderer_first_resize = false;
            this.requestAnimationFrame();
        }
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#last_pointer_x = event.x;
        this.addEventListener('pointermove',   this.#on_pointer_move);
        this.addEventListener('pointerup',     this.#on_pointer_up);
        this.addEventListener('pointercancel', this.#on_pointer_cancel);
        this.setPointerCapture(event.pointerId);
        this.#setCursorGrab(true);
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        const offset = this.#last_pointer_x - event.x;
        if (0 !== offset) {
            this.#renderer.offsetValue(-1.0 * offset / this.offsetWidth * this.#renderer.getSpan());
            this.#onValueChanged();
        }
        this.#last_pointer_x = event.x;
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.removeEventListener('pointermove',   this.#on_pointer_move);
        this.removeEventListener('pointerup',     this.#on_pointer_up);
        this.removeEventListener('pointercancel', this.#on_pointer_cancel);
        this.#setCursorGrab(false);
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
     * 值发生了变化
     */
    #onValueChanged() {
        if (this.#is_setting) {
            return;
        }

        let value = this.#renderer.getValue() * this.#value_scale;
        if (this.#integer) {
            value = parseInt(value);
        }

        this.dispatchUserDefineEvent('datachanged', { 
            data: value,
            value
        });

        this.dispatchUserDefineEvent('changed', { 
            data: value,
            value
        });

        if (isFunction(this.on_value_changed)) {
            this.on_value_changed(value);
        }
    }

    /**
     * 执行渲染
     */
    immediateRender() {
        if (this.#is_waitting_render) {
            this.#is_waitting_render = false;
            cancelAnimationFrame(this.#renderer_request_animation_frame_id);
        }
        this.#onRender();
    }

    /**
     * 请求一帧新的渲染
     */
    requestAnimationFrame() {
        if (this.#is_waitting_render) {
            return;
        }

        this.#is_waitting_render = true;
        this.#renderer_request_animation_frame_id = requestAnimationFrame(
            timestamp => {
                this.#is_waitting_render = false;
                this.immediateRender();
            });
    }
}

CustomElementRegister(tagName, Numizer);
