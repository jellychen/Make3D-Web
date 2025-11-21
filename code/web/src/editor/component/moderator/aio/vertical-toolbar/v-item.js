/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-toolbar-item';

/**
 * AIO Toolbar Item
 */
export default class ToolbarItem extends Element {
    /**
     * 元素
     */
    #container;
    #icon;

    /**
     * 令牌
     */
    #token;

    /**
     * 是否被选中
     */
    #is_selected = false;

    /**
     * 事件回调
     */
    #on_click = (event) => this.#onClick(event);

    /**
     * 获取
     */
    get is_selected() {
        return this.#is_selected;
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
        this.#icon = this.getChild("#icon");
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon",
                "token",
                "selected",
            ]);
        }
        return this.attributes;
    }

    /**
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
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('selected' == name) {
            this.setSelected('true' === _new);
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 关注事件
        this.#container.addEventListener('pointerdown', this.#on_click);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();

        // 取消关注事件
        this.#container.removeEventListener('pointerdown', this.#on_click);
    }

    /**
     * 点击事件
     */
    #onClick(event) {
        if (!this.isSelected()) {
            this.setSelected(true);
            this.bubblesEvent(this, "selected");
        }
    }

    /**
     * 获取令牌
     */
    get token() {
        return this.#token;
    }

    /**
     * 
     * 设置是不是有效
     * 
     * @param {*} enable 
     */
    setEnable(enable) {
        if (enable) {
            this.#container.setAttribute('enable', 'true');
        } else {
            this.#container.setAttribute('enable', 'false');
        }
        return this;
    }

    /**
     * 
     * 设置是不是选中的状态
     * 
     * @param {*} selected 
     * @returns 
     */
    setSelected(selected) {
        selected = 'true' === selected || true === selected;
        if (selected == this.#is_selected) {
            return this;
        }
        
        this.#is_selected = selected;

        if (this.#is_selected) {
            this.#icon.setColorIndex(1);
            this.#container.setAttribute('selected', 'true');
        } else {
            this.#icon.setColorIndex(0);
            this.#container.setAttribute('selected', 'false');
        }
        return this;
    }

    /**
     * 
     * 判断是否被选中
     * 
     * @returns 
     */
    isSelected() {
        return this.#is_selected;
    }
}

CustomElementRegister(tagName, ToolbarItem);
