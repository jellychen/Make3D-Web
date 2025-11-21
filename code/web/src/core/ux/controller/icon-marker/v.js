/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-maker';

/**
 * Icon的图标标志
 */
export default class IconMaker extends Element {
    /**
     * 元素
     */
    #container;
    #svg;

    /**
     * 设置被选中
     */
    set selected(value) {
        this.setSelected(true === value);
    }

    /**
     * 获取被选中
     */
    get selected() {
        return this.#container.hasAttribute('selected');
    }

    /**
     * 设置图标
     */
    set icon(value) {
        this.setIcon(value);
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
        this.#container = this.getChild('#container');
        this.#svg = this.getChild('#icon');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "selected"
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
        } else if ('selected' == name) {
            this.setSelected('false' != _new);
        }
    }

    /**
     * 
     * 设置是不是被选中
     * 
     * @param {*} selected 
     */
    setSelected(selected) {
        if (true === selected) {
            this.#container.setAttribute('selected', '');
        } else {
            this.#container.removeAttribute('selected');
        }
    }

    /**
     * 
     * 设置显示 Icon
     * 
     * @param {*} icon 
     */
    setIcon(icon) {
        if (isString(icon)) {
            this.#svg.setIcon(icon);
        }
    }
}

CustomElementRegister(tagName, IconMaker);