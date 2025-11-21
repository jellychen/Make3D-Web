/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Tab                   from './v';
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-tab-vertical-item';

/**
 * Tab项目
 */
export default class TabItem extends Element {
    /**
     * 元素
     */
    #container;
    #icon;
    #data;

    /**
     *  获取
     */
    get data() {
        return this.#data;
    }

    /**
     * 设置
     */
    set selected(value) {
        this.setSelected(true === value);
    }

    /**
     * 获取
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
        this.#container.onclick = () => this.#onClick();
        this.#icon = this.getChild('#icon');
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
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

        if ('icon' == name) {
            this.#icon.setIcon(_new);
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
     * @param {*} selected 
     */
    setSelected(selected) {
        if (true === selected) {
            this.#container.setAttribute('selected', 'true');
        } else {
            this.#container.setAttribute('selected', 'false');
        }
    }
}

CustomElementRegister(tagName, TabItem);
