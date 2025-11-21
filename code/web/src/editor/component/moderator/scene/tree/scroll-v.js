/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './scroll-v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scroll-v';

/**
 * 垂直滚动条
 */
export default class TreeScroll_V extends Element {
    /**
     * 元素
     */
    #container;
    #bar;

    /**
     * 事件回调
     */
    #on_pointer_down    = (event) => this.#onPointerDown(event);
    #on_pointer_move    = (event) => this.#onPointerMove(event);
    #on_pointer_up      = (event) => this.#onPointerUp(event);
    #on_pointer_cancel  = (event) => this.#onPointerCancel(event);

    /**
     * 数据
     */
    #last_pointer_x;
    #last_pointer_y;

    /**
     * 用来计算bar位置
     */
    #scrollable_content_length = 0;         // 整个内容的高度
    #scrollable_offset = 0;                 // 已经偏移， 0 - scrollable_content_length - scrollable_visible_length
    #scrollable_visible_length = 0;         // 可是区域的高度

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
        this.#bar = this.getChild('#bar');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#bar.addEventListener('pointerdown', this.#on_pointer_down);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#bar.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#bar.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#bar.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#bar.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 设置可见性
     * 
     * @param {Boolean} visible 
     */
    setVisible(visible) {
        if (visible) {
            this.style.visibility = 'visible';
        } else {
            this.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 设置滚动的属性
     * 
     * @param {Number} content_length 
     * @param {Number} offset 
     * @param {Number} visible_height 
     */
    setScrollInfo(content_length, offset, visible_height) {
        this.#scrollable_content_length = content_length;
        this.#scrollable_offset = offset;
        this.#scrollable_visible_length = visible_height;
        this.#adjustBarSize();
        this.#adjustBarPosition();
    }

    /**
     * 
     * 设置滑动的位置
     * 
     * @param {Number} offset 
     */
    setOffset(offset) {
        if (this.#scrollable_offset == offset) {
            return;
        }
        this.#scrollable_offset = offset;
        this.#adjustBarPosition();
    }

    /**
     * 
     * 获取Offset
     * 
     * @returns 
     */
    getOffset() {
        return this.#scrollable_offset;
    }

    /**
     * 调整Bar的尺寸
     */
    #adjustBarSize() {
        const container_h = this.#container.clientHeight;
        const bar_h = (this.#scrollable_visible_length / this.#scrollable_content_length) * container_h;
        if (this.#bar.style.clientHeight == bar_h) {
            return;
        }
        this.#bar.style.height = `${bar_h}px`;
    }

    /**
     * 调整Bar的位置
     */
    #adjustBarPosition() {
        const scroll_area = this.#scrollable_content_length - this.#scrollable_visible_length;
        const offset_percent = this.#scrollable_offset / scroll_area;
        const offset = (this.#container.clientHeight - this.#bar.clientHeight) * offset_percent;
        if (this.#bar.style.scrollTop == offset) {
            return;
        }
        this.#bar.style.top = `${offset}px`;
    }

    /**
     * 
     * 交互事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#last_pointer_y = event.y;
        this.#bar.setPointerCapture(event.pointerId);
        this.#bar.addEventListener('pointermove',   this.#on_pointer_move);
        this.#bar.addEventListener('pointerup',     this.#on_pointer_up);
        this.#bar.addEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 交互事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        const x = event.x;
        const y = event.y;

        // 可滚动的区域
        const scrollable_area = this.#scrollable_content_length - this.#scrollable_visible_length;

        // 调整 Bar 的尺寸
        this.#adjustBarSize();

        // 调整位置
        const container_h = this.#container.clientHeight;
        const bar_h = this.#bar.clientHeight;
        const top = this.#bar.offsetTop;
        let will_top = top + y - this.#last_pointer_y;
        if (will_top + bar_h > container_h) {
            will_top = container_h - bar_h;
        } else if (will_top < 0) {
            will_top = 0;
        }

        if (this.#bar.style.scrollTop == will_top) {
            return;
        }

        this.#bar.style.top = `${will_top}px`;


        // 更新新的值
        this.#scrollable_offset = will_top / (container_h - bar_h) * scrollable_area;

        // 发送事件
        this.dispatchUserDefineEvent('scroll-offset-changed', { value: this.#scrollable_offset });

        // 更新位置
        this.#last_pointer_x = x;
        this.#last_pointer_y = y;
    }

    /**
     * 
     * 交互事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#bar.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#bar.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#bar.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 交互事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }
}

CustomElementRegister(tagName, TreeScroll_V);
