/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-text-input-area';

/**
 * 区域收入
 */
export default class TextInputArea extends Element {
    /**
     * 元素
     */
    #input;
    #on_data_changed;

    /**
     * 正在设置
     */
    #is_setting = false;

    /**
     * 
     * 设置组件的可用性
     * 
     * @param {any} value
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 获取组件的可用性
     */
    get enable() {
        return !(this.#input.disabled);
    }

    /**
     * 设置当前的值
     */
    set value(data) {
        this.#is_setting = true;
        this.#input.value = data;
        this.#is_setting = false;
    }

    /**
     * 获取当前的值
     */
    get value() {
        return this.#input.value;
    }

    /**
     * 
     * 设置值变动的回调
     * 
     * @param {function} callback
     */
    set ondatachanged(callback) {
        this.setOnDataChangedCallback(callback);
    }

    /**
     * 获取回调函数
     */
    get ondatachanged() {
        return this.#on_data_changed;
    }

    /**
     * 
     * 设置只读
     * 
     * @param {Boolean} value
     */
    set readonly(value) {
        this.setReadonly(value);
    }

    /**
     * 判断是不是只读
     */
    get readonly() {
        return null == this.#input.getAttribute("readonly");
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 创建
     */
    onCreate() {
        super.onCreate();
        this.#input = this.getChild('#input');
        this.#input.onpropertychange = () => this.#onValueChanged();
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "readonly", 
                "enable",
                "font-size",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 设置组件的可用性
     * 
     * @param {Boolean} value 
     */
    setEnable(value) {
        if (true === value) {
            this.#input.disabled = false;
        } else {
            this.#input.disabled = true;
        }
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

        if ('readonly' == name) {
            this.setReadonly(_new);
        } else if ('enable' == name) {
            this.setEnable('false' != _new);
        } else if ('font-size' == name) {
            this.setFontSize(_new);
        }
    }

    /**
     * 
     * 设置值变动的回调
     * 
     * @param {function} callback 
     */
    setOnDataChangedCallback(callback) {
        if (isFunction(callback)) {
            this.#on_data_changed = callback;
        } else {
            this.#on_data_changed = undefined;
        }
    }

    /**
     * 
     * 设置是不是只读
     * 
     * @param {Boolean} readonly 
     */
    setReadonly(readonly) {
        if (true === readonly) {
            this.#input.setAttribute("readonly", "readonly");
        } else {
            this.#input.removeAttribute("readonly");
        }
    }

    /**
     * 选取所有的内容
     */
    selectAll() {
        this.#input.select();
    }

    /**
     * 上焦点
     */
    setFocus() {
        this.#input.focus();
    }

    /**
     * 
     * 设置字体的尺寸
     * 
     * @param {*} css_value 
     */
    setFontSize(css_value) {
        this.#input.style.fontSize = css_value;
    }

    /**
     * 值发生了变化
     */
    #onValueChanged() {
        if (this.#is_setting) {
            return;
        }

        this.dispatchUserDefineEvent('changed', {
            value: this.#input.value
        });

        if (isFunction(this.#on_data_changed)) {
            this.#on_data_changed(this.#input.value);
        }
    }
}

CustomElementRegister(tagName, TextInputArea);
