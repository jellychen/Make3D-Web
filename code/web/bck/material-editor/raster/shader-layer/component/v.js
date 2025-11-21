/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMenuColour        from './v-menu-colour';
import ShowMenuProcessor     from './v-menu-processor';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer-component';

/**
 * 颜色层
 */
export default class Container extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #content;
    #menu_add;
    #menu_fliter;

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
        this.#container   = this.getChild('#container');
        this.#content     = this.getChild('#content');
        this.#menu_add    = this.getChild('#add');
        this.#menu_fliter = this.getChild('#fliter');
        this.#menu_add.onclick    = () => this.#onClickAdd();
        this.#menu_fliter.onclick = () => this.#onClickFliter();
    }

    /**
     * 
     * 设置
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 点击菜单
     */
    #onClickAdd() {
        ShowMenuColour(this.#menu_add, token => {
        }, new Set());
    }

    /**
     * 点击过滤器
     */
    #onClickFliter() {
        ShowMenuProcessor(this.#menu_fliter, token => {
        }, new Set());
    }
}

CustomElementRegister(tagName, Container);
