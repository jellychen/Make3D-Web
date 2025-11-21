/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-button-brief';

/**
 * 简化的按钮
 */
export default class IconButtonBrief extends Element {
    /**
     * 元素
     */
    #svg;
    #btn;
    #btn_click_callback;

    /**
     * 是不是被选中
     */
    #selected = false;

    /**
     * 鼠标是不是在内
     */
    #is_pointer_in = false;

    /**
     * 事件回调
     */
    #on_pointer_enter;
    #on_pointer_leave;
    #on_click;

    /**
     * 设置按钮是否可用
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 获取按钮是否可用
     */
    get enable() {
        return !(this.#btn.disabled);
    }

    /**
     * 设置是不是选择
     */
    set selected(value) {
        this.setSelected(value);
    }

    /**
     * 判断是不是选中
     */
    get selected() {
        return this.#selected;
    }

    /**
     * 设置点击的回调函数
     * 
     * @param {function} callback
     */
    set onclick(callback) {
        if (isFunction(callback)) {
            this.#btn_click_callback = callback;
        } else {
            this.#btn_click_callback = undefined;
        }
    }

    /**
     * 获取点击的回调函数
     */
    get onclick() {
        return this.#btn_click_callback;
    }

    /**
     * setIcon
     * 
     * @param {string} src
     */
    set icon(src) {
        this.setIcon(src);
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.#btn_click_callback = undefined;
        this.#on_pointer_enter = (event) => this.#onPointerEnter(event);
        this.#on_pointer_leave = (event) => this.#onPointerLeave(event);
        this.#on_click         = (event) => this.#onClick(event);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#svg = this.getChild('#icon');
        this.#btn = this.getChild('#btn');

        // 颜色设置
        this.#svg.setColor_0('var(--btn-brief-color-normal)');
        this.#svg.setColor_1('var(--btn-brief-color-highlight)');
        this.#svg.setColor_2('var(--btn-brief-color-selected)');
        this.#svg.setColor_3('var(--btn-brief-color-disable)');

        // 事件监听
        this.#btn.onclick = (event) => {
            if (!this.enable) {
                return;
            }

            this.dispatchUserDefineEvent('client', {});
            if (this.#btn_click_callback) {    
                this.#btn_click_callback(this);
            }
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "enable", 
                "selected", 
                "color-normal", 
                "color-highlight", 
                "color-selected", 
                "color-disable"
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

        if ('icon' == name) {
            this.setIcon(_new);
        } else if ('color-normal' == name) {
            this.#svg.setColor_0(_new);
        } else if ('color-highlight' == name) {
            this.#svg.setColor_1(_new);
        } else if ('color-selected' == name) {
            this.#svg.setColor_2(_new);
        } else if ('color-disable' == name) {
            this.#svg.setColor_3(_new);
        } else if ('enable' == name) {
            this.enable = ('false' != _new);
        } else if ('selected' == name) {
            this.selected = ('false' != _new);
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#btn.addEventListener('pointerenter', this.#on_pointer_enter);
        this.#btn.addEventListener('pointerleave', this.#on_pointer_leave);
        this.#btn.addEventListener('click', this.#on_click);
        this.#update();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#btn.removeEventListener('pointerenter', this.#on_pointer_enter);
        this.#btn.removeEventListener('pointerleave', this.#on_pointer_leave);
        this.#btn.removeEventListener('click', this.#on_click);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {Boolean} enable 
     */
    setEnable(enable) {
        if (this.#btn.disabled == !enable) {
            return;
        }
        this.#btn.disabled = !enable;
        this.#update();
    }

    /**
     * 
     * 设置是不是选择
     * 
     * @param {*} selected 
     */
    setSelected(selected) {
        selected = true === selected;
        if (this.#selected == selected) {
            return;
        }
        this.#selected = selected;
        this.#update();
    }

    /**
     * 
     * 设置 ICON SVG
     * 
     * @param {string} src 
     */
    setIcon(src) {
        if (isString(src)) {
            this.#svg.setIcon(src);
        }
    }

    /**
     * 更新颜色
     */
    #update() {
        if (!this.enable) {
            this.#svg.setColorIndex(3);
            return;
        }

        if (this.#selected) {
            this.#svg.setColorIndex(2);
            return;
        }

        if (this.#is_pointer_in) {
            this.#svg.setColorIndex(1);
        } else {
            this.#svg.setColorIndex(0);
        }
    }

    /**
     * 
     * 事件回调
     * 
     * @param {*} event 
     */
    #onPointerEnter(event) {
        if (!this.enable || this.#selected) {
            return;
        }
        this.#svg.setColorIndex(1);
        this.#is_pointer_in = true;
    }

    /**
     * 
     * 事件回调
     * 
     * @param {*} event 
     */
    #onPointerLeave(event) {
        if (!this.enable || this.#selected) {
            return;
        }
        this.#svg.setColorIndex(0);
        this.#is_pointer_in = false;
    }

    /**
     * 
     * 事件回调
     * 
     * @param {*} event 
     */
    #onClick(event) {
        if (!this.enable) {
            return;
        }

        this.#selected = !this.#selected;
        this.dispatchUserDefineEvent("click", {});
        this.dispatchUserDefineEvent("selected-changed", {
            selected: this.#selected,
        });
        this.#update();
    }
}

CustomElementRegister(tagName, IconButtonBrief);
