/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-text-input-number';

/**
 * 只能输入整数的输入框
 */
export default class TextInputNumber extends Element {
    /**
     * 内部组件
     */
    #title;
    #input;
    #on_data_changed;

    /**
     * 限制范围
     */
    #limit_min;
    #limit_max;

    /**
     * 值
     */
    #value = 0;

    /**
     * 正在设置
     */
    #is_setting = false;

    /**
     * 设置范围
     */
    set min(data) {
        this.#limit_min = parseFloat(data);
    }

    /**
     * 获取范围
     */
    get min() {
        return this.#limit_min;
    }

    /**
     * 设置范围
     */
    set max(data) {
        this.#limit_max = parseFloat(data);
    }

    /**
     * 获取范围
     */
    get max() {
        return this.#limit_max;
    }

    /**
     * 
     * 设置组件的可用性
     * 
     * @param {boolean} value
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
        this.setValue(data, true);
    }

    /**
     * 获取当前的值
     */
    get value() {
        return parseFloat(this.#input.value);
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
     * 设置
     */
    set readonly(value) {
        this.setReadonly(value);
    }

    /**
     * 获取
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
        this.#title = this.getChild('#title');
        this.#input = this.getChild('#input');
        this.#input.value = 0;
        this.#input.ondatachanged = (value) => {
            value = parseFloat(value);
            let clamped_value = this.#clamp(value);
            if (clamped_value != value) {
                this.#input.value = clamped_value;
            }

            if (this.#value == clamped_value) {
                return;
            }

            this.#value = clamped_value;

            // 发送事件
            this.#onValueChanged();
        };
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "readonly", 
                "enable", 
                "data",
                "enable-title",
                "title-data", 
                "title-token",
                "title-color",
                "min",
                "max",
                "font-size",
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

        if ('readonly'                 ==  name) {
            this.setReadonly('true'    ==  _new);
        } else if ('enable'            ==  name) {
            this.setEnable('true'      ==  _new);
        } else if ('data'              ==  name) {
            this.value                 =   _new;
        } else if ('enable-title'      ==  name)  {
            this.setEnableTitle('true' === _new);
        } else if ('title-data'        ==  name) {
            this.setTitleData(_new);
        } else if ('title-token'       ==  name) {
            this.setTitleToken(_new);
        } else if ('title-color'       ==  name) {
            this.setTitleColor(_new);
        } else if ('min'               ==  name) {
            this.min                   =   parseFloat(_new);
        } else if ('max'               ==  name) {
            this.max                   =   parseFloat(_new);
        } else if ('font-size'         ==  name) {
            this.setFontSize(_new);
        }
    }

    /**
     * 
     * 过滤一下最大值和最小值
     * 
     * @param {number} data 
     */
    #clamp(data) {
        if (!isNumber(data)) {
            return 0;
        }

        if (undefined != this.#limit_min) {
            if (data < this.#limit_min) {
                data = this.#limit_min;
            }
        }

        if (undefined != this.#limit_max) {
            if (data > this.#limit_max) {
                data = this.#limit_max;
            }
        }

        return data;
    }

    /**
     * 
     * 设置组件的可用性
     * 
     * @param {boolean} value 
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
     * 设置
     * 
     * @param {boolean} enable 
     */
    setEnableTitle(enable) {
        if (true === enable) {
            this.#title.style.display = 'block';
            this.#input.classList.remove('compactness');
        } else {
            this.#title.style.display = 'none';
            this.#input.classList.add('compactness');
        }
    }

    /**
     * 
     * 设置title
     * 
     * @param {string} data
     */
    setTitleData(data) {
        if (isString(data)) {
            this.#title.setData(data);
        }
    }

    /**
     * 
     * 设置Title Token
     * 
     * @param {string} token 
     */
    setTitleToken(token) {
        if (isString(token)) {
            this.#title.setToken(token);
        }
    }

    /**
     * 
     * 设置Title Color
     * 
     * @param {*} color 
     */
    setTitleColor(color) {
        this.#title.setColor(color);
    }

    /**
     * 
     * 设置显示的值
     * 
     * @param {number} value 
     */
    setValue(value) {
        value             = parseFloat(value);
        value             = this.#clamp(value).toFixed(3);
        if (this.#value   == value) {
            return;
        }

        this.#is_setting  = true;
        this.#input.value = value;
        this.#value       = value;
        this.#is_setting  = false;
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
     * 设置字体尺寸
     * 
     * @param {*} css_value 
     */
    setFontSize(css_value) {
        this.#input.setFontSize(css_value);
        this.#title.setSize(css_value);
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
     * 值发生了变化
     */
    #onValueChanged() {
        if (this.#is_setting) {
            return;
        }

        if (this.#on_data_changed) {
            this.#on_data_changed(this.#value);
        }

        this.dispatchUserDefineEvent('changed', { 
            data: this.#value
        });
    }
}

CustomElementRegister(tagName, TextInputNumber);
