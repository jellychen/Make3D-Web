/* eslint-disable no-unused-vars */

import isNumber              from 'lodash/isNumber';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-scrollbar-container.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-scrollbar-container';

/**
 * 滚动条
 */
export default class ScrollbarContainer extends Element {
    /**
     * 页面元素
     */
    #container;
    #bar;

    /**
     * bar的方向
     * 
     * true  竖直
     * false 水平
     * 
     */
    #bar_dir = true;

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
     * 事件回调
     */
    #on_pointer_down    = event => this.#onPointerDown(event);
    #on_pointer_move    = event => this.#onPointerMove(event);
    #on_pointer_up      = event => this.#onPointerUp(event);
    #on_pointer_cancel  = event => this.#onPointerCancel(event);

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
        this.setBarDir(true);
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "dir"
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
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

        if ('dir' == name) {
            this.setBarDir('v' === _new);
        }
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
     * vh == true  竖直
     * vh == false 水平
     * 
     * @param {boolean} vh 
     */
    setBarDir(vh = true) {
        vh = true === vh;
        if (vh) {
            this.#bar.setAttribute('direction', 'v');
        } else {
            this.#bar.setAttribute('direction', 'h');
        }
        this.#bar_dir = vh;
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
        if (isNumber(content_length) &&
            isNumber(offset) &&
            isNumber(visible_height)) {
            this.#scrollable_content_length = content_length;
            this.#scrollable_offset = offset;
            this.#scrollable_visible_length = visible_height;
            this.#adjustBarSize();
            this.#adjustBarPosition();
        }
    }

    /**
     * 
     * 设置滑动的位置
     * 
     * @param {number} offset 
     */
    setOffset(offset) {
        if (isNumber(offset)) {
            if (this.#scrollable_offset == offset) {
                return;
            }
            this.#scrollable_offset = offset;
            this.#adjustBarPosition();
        }
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
     * 
     * 鼠标按下
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        if (event.target != this.#bar) {
            return;
        }
        this.#bar.setPointerCapture(event.pointerId);
        this.#last_pointer_x = event.x;
        this.#last_pointer_y = event.y;
        this.#bar.addEventListener('pointermove',   this.#on_pointer_move);
        this.#bar.addEventListener('pointerup',     this.#on_pointer_up);
        this.#bar.addEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 调整Bar的尺寸
     */
    #adjustBarSize() {
        // 竖直
        if (true === this.#bar_dir) {
            let container_h = this.#container.clientHeight;
            let bar_h = (this.#scrollable_visible_length / this.#scrollable_content_length) * container_h;
            if (this.#bar.style.clientHeight == bar_h) {
                return;
            }
            this.#bar.style.height = `${bar_h}px`;
        }

        // 水平
        else {
            let container_w = this.#container.clientWidth;
            let bar_w = (this.#scrollable_visible_length / this.#scrollable_content_length) * container_w;
            if (this.#bar.style.clientWidth == bar_w) {
                return;
            }
            this.#bar.style.width = `${bar_w}px`;
        }
    }

    /**
     * 调整Bar的位置
     */
    #adjustBarPosition() {
        // 可以滚动的区域
        let scroll_area = this.#scrollable_content_length - this.#scrollable_visible_length;

        // 竖直
        if (true === this.#bar_dir) {
            let offset_percent = this.#scrollable_offset / scroll_area;
            let offset = (this.#container.clientHeight - this.#bar.clientHeight) * offset_percent;
            if (this.#bar.style.scrollTop == offset) {
                return;
            }
            this.#bar.style.top = `${offset}px`;
        }

        // 水平
        else {
            let offset_percent = this.#scrollable_offset / scroll_area;
            let offset = (this.#container.clientWidth - this.#bar.clientWidth) * offset_percent;
            if (this.#bar.style.scrollLeft == offset) {
                return;
            }
            this.#bar.style.left = `${offset}px`;
        }
    }

    /**
     * 
     * 鼠标移动
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

        // 竖直
        if (true === this.#bar_dir) {
            let container_h = this.#container.clientHeight;
            let bar_h = this.#bar.clientHeight;
            let top = this.#bar.offsetTop;
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
        }

        // 水平
        if (false === this.#bar_dir) {
            let container_w = this.#container.clientWidth;
            let bar_w = this.#bar.clientWidth;
            let left = this.#bar.offsetLeft;
            let will_left = left + x - this.#last_pointer_x;
            if (will_left + bar_w > container_w) {
                will_left = container_w - bar_w;
            } else if (will_left < 0) {
                will_left = 0;
            }

            if (this.#bar.style.scrollLeft == will_left) {
                return;
            }

            this.#bar.style.left = `${will_left}px`;

            // 更新新的值
            this.#scrollable_offset = will_left / (container_w - bar_w) * scrollable_area;
        }

        // 发送事件
        this.dispatchUserDefineEvent('scroll-offset-changed', { value: this.#scrollable_offset });

        // 更新位置
        this.#last_pointer_x = x;
        this.#last_pointer_y = y;
    }

    /**
     * 
     * 鼠标抬起来
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
     * 鼠标事件取消
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }
}

CustomElementRegister(tagName, ScrollbarContainer);
