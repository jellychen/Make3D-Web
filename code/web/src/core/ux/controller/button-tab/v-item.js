/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Tab                   from './v';
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-button-tab-item';

/**
 * Tab Item
 */
export default class ButtonTabItem extends Element {
    /**
     * 元素
     */
    #container;
    #text;
    #data;

    /**
     * 获取内置数据
     */
    get data() {
        return this.#data;
    }

    /**
     * 设置选择状态
     */
    set selected(value) {
        this.setSelected(value);
    }

    /**
     * 判断是不是被选中
     */
    get selected() {
        return 'true' == this.#container.getAttribute('selected');
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#text      = this.getChild('#text');
        this.#container.onclick = () => this.#onClick();
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "title-token", 
                "title-data", 
                "data"
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

        if ('title-token' == name) {
            this.#text.setToken(_new);
        } else if ('title-data' == name) {
            this.#text.setData(_new);
        } else if ('data' == name) {
            this.#data = _new;
        }
    }

    /**
     * 点击事件
     */
    #onClick() {
        if (!this.selected) {
            this.setSelected(true);
        }
    }

    /**
     * 
     * 设置是不是
     * 
     * @param {boolean} selected 
     */
    setSelected(selected) {
        if (true === selected) {
            this.#container.setAttribute('selected', 'true');
        } else {
            this.#container.setAttribute('selected', 'false');
        }
    }    
}

CustomElementRegister(tagName, ButtonTabItem);
