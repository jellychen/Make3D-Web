/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-text-input';

/**
 * 单行输入
 */
export default class TextInput extends Element {
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
     * 回调函数
     */
    #onchange = () => this.#onValueChanged();

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
        if (isString(data)) {
            this.#input.value = data;
        } else {
            this.#input.value = String(data);
        }
        this.#is_setting = false;
    }

    /**
     * 获取当前的值
     */
    get value() {
        return this.#input.value;
    }

    /**
     * 设置占位
     */
    set placeholder(value) {
        if (isString(value)) {
            this.#input.setAttribute("placeholder", value);
        }
    }

    /**
     * 获取占位
     */
    get placeholder() {
        return this.#input.getAttribute("placeholder");
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
     * @param {string} value
     */
    set type(value) {
        this.setType(value);
    }

    /**
     * 获取显示的类型
     */
    get type() {
        return this.#input.getAttribute("type");
    }

    /**
     * @param {Boolean} value
     */
    set readonly(value) {
        this.setReadonly(value);
    }

    /**
     * 
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
     * 初始化
     */
    onCreate() {
        super.onCreate();
        this.#input = this.getChild('#text-input');
        this.#input.onwheel = (event) => event.preventDefault();
        this.#input.onchange = this.#onchange;
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "type", 
                "readonly", 
                "enable",
                "max-length",
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
        
        if ('type'                   == name) {
            this.setType(_new);
        } else if ('readonly'        == name) {
            this.setReadonly(_new);
        } else if ('enable'          == name) {
            this.setEnable('false'  !=  _new);
        } else if ('max-length'      == name) {
            this.setMaxLength(_new);
        } else if ('font-size'       == name) {
            this.setFontSize(_new);
        }
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     * @returns 
     */
    setValue(value) {
        if (this.value === value) {
            return;
        }

        this.#is_setting = true;
        this.value = value;
        this.#is_setting = false;
    }

    /**
     * 
     * 设置最大长度
     * 
     * @param {Number} length 
     */
    setMaxLength(length) {
        this.#input.setAttribute('maxLength', `${parseInt(length)}`);
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
     * 设置类型 "number"|"password"|"text"
     * 
     * @param {*} type 
     */
    setType(type) {
        if (isString(type)) {
            this.#input.setAttribute("type", type);
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

CustomElementRegister(tagName, TextInput);
