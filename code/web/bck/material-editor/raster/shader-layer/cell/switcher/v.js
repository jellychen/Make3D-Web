/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-switcher';

/**
 * 开关
 */
export default class Switcher extends Element {
    /**
     * 元素
     */
    #name;
    #switcher;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 获取
     */
    get selected() {
        return this.#switcher.checked;
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
        this.#switcher = this.getChild('#switcher');
        this.#switcher.setOnChangedCallback(() => {
            this.#onValueChanged();
        });
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
                "selected",
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

        if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('selected' == name) {
            this.setSelected('true' == _new);
        }
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        this.#name.setToken(token);
    }

    /**
     * 
     * 设置是否选中
     * 
     * @param {*} selected 
     */
    setSelected(selected) {
        this.#switcher.checked = true == selected;
    }

    /**
     * 值发生变化
     */
    #onValueChanged() {
        this.bubblesEvent({
            token  : this.#token,
            element: this,
            value  : this.selected,
        });
    }
}

CustomElementRegister(tagName, Switcher);
