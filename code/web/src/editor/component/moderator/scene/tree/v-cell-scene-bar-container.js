/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-cell-scene-bar-container.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene-tree-scene-bar-container';

/**
 * 场景Cell的按钮扩展
 */
export default class SceneBarContainer extends Element {
    /**
     * 元素
     */
    #collapsible;
    #refresh;

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
        this.#collapsible = this.getChild('#collapsible');
        this.#refresh = this.getChild('#refresh');
        this.#collapsible.addEventListener('pointerdown', (event) => {
            this.#onClickCollapsible(event);
        });
        this.#refresh.addEventListener('pointerdown', (event) => {
            this.#onClickRefresh(event);
        });
    }

    /**
     * 
     * 点击折叠按钮
     * 
     * @param {*} event 
     */
    #onClickCollapsible(event) {
        this.bubblesEvent({command: 'scene.collapse'});
    }

    /**
     * 
     * 点击刷新按钮
     * 
     * @param {*} event 
     */
    #onClickRefresh(event) {
        this.bubblesEvent({command: 'scene.refresh'});
    }
}

CustomElementRegister(tagName, SceneBarContainer);
