/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './items';
import ItemCreator           from './items/creator';
import ShowMenu              from './v-menu';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer-effect';

/**
 * 特效层
 */
export default class Container extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 材质
     */
    #material;

    /**
     * 元素
     */
    #container;
    #content;
    #menu_add;
    #none;
    
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
        this.#content   = this.getChild('#content');
        this.#menu_add  = this.getChild('#add');
        this.#none      = this.getChild('#none');
        this.#menu_add.onclick = () => this.#onClickMenu();
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
     * 
     * 安装材质
     * 
     * @param {*} material 
     */
    setupMaterial(material) {
        this.#material = material;
    }

    /**
     * 
     * 添加
     * 
     * @param {*} type 
     */
    addItem(type) {
        const item = ItemCreator(type, this.#coordinator);
        if (!item) {
            return;
        }

        if (!isFunction(item.setupMaterial)) {
            item.setupMaterial(this.#material);
        }
        
        item.onDeleted = () => this.#checkIfShouldShowNone();
        this.#content.appendChild(item);
        this.#checkIfShouldShowNone();
    }

    /**
     * 点击菜单
     */
    #onClickMenu() {
        const set = new Set();
        for (const child of this.#content.childNodes) {
            if (!isUndefined(child.type)) {
                set.add(child.type);
            }
        }
        ShowMenu(this.#menu_add, token => {
            this.addItem(token);
        }, set);
    }

    /**
     * 检测是否需要显示空
     */
    #checkIfShouldShowNone() {
        if (0 == this.#content.childNodes.length) {
            this.#none.setVisible(true);
        } else {
            this.#none.setVisible(false);
        }
    }
}

CustomElementRegister(tagName, Container);
