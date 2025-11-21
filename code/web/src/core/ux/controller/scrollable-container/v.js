/* eslint-disable no-unused-vars */

import isNumber              from 'lodash/isNumber';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-scrollable-container';

/**
 * 自带滚动条的容器
 */
export default class ScrollableContainer extends Element {
    /**
     * 页面元素
     */
    #container;
    #sub_container;
    #content;
    #scroll_v;
    #scroll_h;

    /**
     * 监控尺寸变化
     */
    #resize_observer;
    #mutation_observer;

    /**
     * 等待重新计算
     */
    #is_waitting_recalc_scrollbar = false;

    /**
     * 事件回调
     */
    #on_scroll           = () => this.#onScroll();
    #on_v_scroll_changed = () => this.#onVScrollChanged();
    #on_h_scroll_changed = () => this.#onHScrollChanged();

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
        this.#container     = this.getChild('#container');
        this.#sub_container = this.getChild('#sub-container');
        this.#content       = this.getChild('#content');
        this.#scroll_v      = this.getChild('#scrollbar-v');
        this.#scroll_h      = this.getChild('#scrollbar-h');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "enable-scroll-v", 
                "enable-scroll-h",
            ]);
        }
        return this.attributes;
    }

    /**
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

        if ('enable-scroll-v' == name) {
            this.setEnableScroll_V(_new == "true");
        } else if ('enable-scroll-h' == name) {
            this.setEnableScroll_H(_new == "true");
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 监控尺寸发生变化
        this.#resize_observer = new ResizeObserver(() => this.#needRecalcScrollBarNextFrame());
        this.#resize_observer.observe(this.#container);
        this.#resize_observer.observe(this.#sub_container);
        this.#resize_observer.observe(this.#content);

        // 监控孩子发生变化
        this.#mutation_observer = new MutationObserver(() => this.#needRecalcScrollBarNextFrame());

        this.#mutation_observer.observe(this, { 
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true 
        });

        // 监听事件
        this.#sub_container.addEventListener('scroll', this.#on_scroll);
        this.#scroll_v.addEventListener('scroll-offset-changed', this.#on_v_scroll_changed);
        this.#scroll_h.addEventListener('scroll-offset-changed', this.#on_h_scroll_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#resize_observer) {
            this.#resize_observer.disconnect();
            this.#resize_observer = undefined;
        }

        if (this.#mutation_observer) {
            this.#mutation_observer.disconnect();
            this.#mutation_observer = undefined;
        }

        this.#sub_container.removeEventListener('scroll', this.#on_scroll);
        this.#scroll_v.removeEventListener('scroll-offset-changed', this.#on_v_scroll_changed);
        this.#scroll_h.removeEventListener('scroll-offset-changed', this.#on_h_scroll_changed);
    }

    /**
     * 
     * 滚动到指定的位置
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} smooth 
     */
    scrollTo(x, y, smooth) {
        if (!isNumber(x)) x = 0;
        if (!isNumber(y)) y = 0;
        this.#sub_container.scrollTo({
            left: x,
            top: y,
            behavior: "smooth"
        });
    }

    /**
     * 
     * 垂直
     * 
     * @param {*} enable 
     */
    setEnableScroll_V(enable) {
        if (enable) {
            this.#content.style.height = "min-content";
        } else {
            this.#content.style.height = "100%";
        }
    }

    /**
     * 
     * 横向
     * 
     * @param {*} enable 
     */
    setEnableScroll_H(enable) {
        if (enable) {
            this.#content.style.width = "min-content";
        } else {
            this.#content.style.width = "100%";
        }
    }

    /**
     * 下一帧重新计算滚动条
     */
    #needRecalcScrollBarNextFrame() {
        if (this.#is_waitting_recalc_scrollbar) {
            return;
        }
        this.#is_waitting_recalc_scrollbar = true;
        this.nextFrameTick(() => {
            this.#is_waitting_recalc_scrollbar = false;
            this.#needRecalcScrollBar();
        });
    }

    /**
     * 重新计算滚动条逻辑
     */
    #needRecalcScrollBar() {
        let client_w = this.#sub_container.clientWidth;
        let client_h = this.#sub_container.clientHeight;
        let scroll_w = this.#sub_container.scrollWidth;
        let scroll_h = this.#sub_container.scrollHeight;

        // 获取 scroll 位置 
        let scroll_t = this.#sub_container.scrollTop;
        let scroll_l = this.#sub_container.scrollLeft;

        // 调整
        if (scroll_t + client_h > scroll_h) {
            scroll_t = scroll_h - client_h;
            this.#sub_container.scrollTop = scroll_t;
        }

        if (scroll_l + client_w > scroll_w) {
            scroll_l = scroll_w - client_w;
            this.#sub_container.scrollLeft = scroll_l;
        }

        // 判断
        let need_v_scroll = scroll_h > client_h;
        let need_h_scroll = scroll_w > client_w;

        // 调整 竖直
        if (!need_v_scroll) {
            this.#scroll_v.style.display = 'none';
        } else {
            this.#scroll_v.style.display = 'block';
            this.#scroll_v.setScrollInfo(scroll_h, scroll_t, client_h);
            if (need_h_scroll) {
                this.#scroll_v.setAttribute('aside', 'true');
            } else {
                this.#scroll_v.setAttribute('aside', '');
            }
        }

        // 调整 水平
        if (!need_h_scroll) {
            this.#scroll_h.style.display = 'none';
        } else {
            this.#scroll_h.style.display = 'block';
            this.#scroll_h.setScrollInfo(scroll_h, scroll_l, client_w);
            if (need_v_scroll) {
                this.#scroll_h.setAttribute('aside', 'true');
            } else {
                this.#scroll_h.setAttribute('aside', '');
            }
        }
    }

    /**
     * 滚动
     */
    #onScroll() {
        let l = this.#sub_container.scrollLeft;
        let t = this.#sub_container.scrollTop;
        this.#scroll_v.setOffset(t);
        this.#scroll_h.setOffset(l);
    }

    /**
     * 滚动条的变化
     */
    #onVScrollChanged() {
        this.#sub_container.scrollTop = this.#scroll_v.getOffset();
    }

    /**
     * 滚动条的变化
     */
    #onHScrollChanged() {
        this.#sub_container.scrollLeft = this.#scroll_h.getOffset();
    }
}

CustomElementRegister(tagName, ScrollableContainer);
