/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-drawer-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-graph-node-drawer';

/**
 * 抽屉
 */
export default class Drawer extends Element {
    /**
     * 元素
     */
    #container;
    #title;
    #fold;
    #content;

    /**
     * 默认是展开
     */
    #fold_open = false;

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
        this.#title     = this.getChild('#title');
        this.#fold      = this.getChild('#fold');
        this.#content   = this.getChild('#content');
        this.#fold.onclick = event => this.#onClickFold();
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "text", 
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

        if ('text' == name) {
            this.#title.setToken(_new);
        }
    }

    /**
     * 
     * 显示/隐藏
     * 
     * @param {*} show 
     */
    #showContent(show) {
        if (show) {
            this.#content.style.display = 'flex';
        } else {
            this.#content.style.display = 'none';
        }
    }

    /**
     * 点击折叠按钮
     */
    #onClickFold() {
        this.#fold_open = !this.#fold_open;
        if (this.#fold_open) {
            this.#fold.setAttribute('status', 'open');
        } else {
            this.#fold.setAttribute('status', 'close');
        }
        this.#showContent(this.#fold_open);
    }
}

CustomElementRegister(tagName, Drawer);
