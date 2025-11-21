/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-switcher';

/**
 * 二值选择
 */
export default class Switcher extends Element {
    /**
     * 元素
     */
    #container;
    #switcher;
    #on_changed_callback;

    /**
     * 
     * 获取是不是选中
     */
    get checked() {
        return this.#switcher.checked;
    }

    /**
     * @param {boolean} value
     * 
     * 设置是不是选中
     */
    set checked(value) {
        this.setChecked(value);
    }

    /**
     * @param {boolean} value
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 
     */
    get enable() {
        return 'true' == this.#container.getAttribute('enable');
    }

    /**
     * 设置
     */
    set check(value) {
        this.setChecked(value);
    }

    /**
     * 获取
     */
    get check() {
        return this.#switcher.checked;
    }

    /**
     * @param {function} callback
     */
    set onchanged(callback) {
        this.setOnChangedCallback(callback);
    }

    /**
     * 获取
     */
    get onchanged() {
        return this.#on_changed_callback;
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
        this.#container = this.getChild("#container");
        this.#switcher  = this.getChild('#switcher');
        this.#switcher.onchange = () => {
            if (this.#on_changed_callback) {
                this.#on_changed_callback(this, this.checked);
            }
            
            this.dispatchUserDefineEvent('changed', {
                checked: this.#switcher.checked
            });
        };
    }

    /**
     * 获取支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'enable',
                'checked'
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

        if (name == "enable") {
            this.setEnable('true' == _new);
        } else if (name == "checked") {
            this.setChecked('true' == _new);
        }
    }

    /**
     * 设置是不是选中
     * 
     * @param {boolean} value 
     */
    setChecked(value) {
        value = value === true;
        this.#switcher.checked = value;
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} value 
     */
    setEnable(value) {
        if (true === value) {
            this.#container.setAttribute('enable', 'true');
        } else {
            this.#container.setAttribute('enable', 'false');
        }
    }

    /**
     * 
     * 设置状态变化后的回调
     * 
     * @param {function} callback 
     */
    setOnChangedCallback(callback) {
        if (isFunction(callback)) {
            this.#on_changed_callback = callback;
        } else {
            this.#on_changed_callback = undefined;
        }
    }
}

CustomElementRegister(tagName, Switcher);
