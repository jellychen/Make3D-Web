/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-status';

/**
 * 状态的Icon
 */
export default class Status extends Element {
    /**
     * 页面元素
     */
    #icon;
    #value;

    /**
     * @param {string} data
     */
    set value(data) {
        if (isString(data)) {
            this.setValue(data);
        }
    }

    /**
     * 获取值
     */
    get value() {
        return this.#value;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 获取支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'value'
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配支持
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

        if ('value' == name) {
            this.setValue(_new);
        }
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#icon = this.getChild('#icon');
        this.setValue('success');
    }

    /**
     * 
     * 'success'|'info'|'warn'|'error'
     * 
     * @param {string} value 
     */
    setValue(value) {
        if (!isString(value)) {
            return;
        }

        if (this.#value == value) {
            return;
        }

        switch (value) {
            case 'success':
                this.#value = value;
                this.#icon.setIcon('ui/success.svg');
                this.#icon.setAttribute('status', value);
                break;

            case 'info':
                this.#value = value;
                this.#icon.setIcon('ui/info.svg');
                this.#icon.setAttribute('status', value);
                break;

            case 'warn':
                this.#value = value;
                this.#icon.setIcon('ui/warn.svg');
                this.#icon.setAttribute('status', value);
                break;

            case 'error':
                this.#value = value;
                this.#icon.setIcon('ui/error.svg');
                this.#icon.setAttribute('status', value);
                break;
        }
    }
}

CustomElementRegister(tagName, Status);

