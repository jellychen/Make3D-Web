/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-color';

/**
 * 颜色
 */
export default class Color extends Element {
    /**
     * 元素
     */
    #name;
    #selector;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 获取当前的颜色， 字符串
     */
    get hexColor() {
        return this.#selector.hexColor;
    }

    /**
     * 获取当前的颜色，Hex数字
     */
    get hexValue() {
        return this.#selector.hexValue;
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
        this.#name     = this.getChild('#name');
        this.#selector = this.getChild('#selector');
        this.#selector.setEnableAlpha(false);
        this.#selector.addEventListener('color-changed', event => {
            this.#onColorChanged();
        });
    }

    /**
     * 获取支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'name',
                'name-token',
                'color',
                'token',
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

        if ('name' == name) {
            this.setName(_new);
        } else if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        } else if ('token' == name) {
            this.#token = _new;
        }
    }

    /**
     * 
     * 设置显示名称
     * 
     * @param {*} name 
     */
    setName(name) {
        if (isString(name)) {
            this.#name.setRaw(name);
        }
    }

    /**
     * 
     * 设置显示名称
     * 
     * @param {*} token 
     */
    setNameToken(token) {
        if (isString(token)) {
            this.#name.setToken(token);
        }
    }

    /**
     * 
     * 设置
     * 
     * hex 或者 字符串
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#selector.setPanColor(color);
    }

    /**
     * 
     * 当所有颜色发生了变化
     * 
     * @param {*} event 
     */
    #onColorChanged(event) {
        this.bubblesEvent({
            token  : this.#token,
            element: this,
            value  : this.hexColor,
        });
    }
}

CustomElementRegister(tagName, Color);
