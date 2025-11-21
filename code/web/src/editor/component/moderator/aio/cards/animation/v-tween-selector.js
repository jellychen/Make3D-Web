/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import TweenIcon             from './v-tween';
import Html                  from './v-tween-selector-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-tween-selector';

/**
 * 动画选择器
 */
export default class TweenSelector extends Element {
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
        const container = this.getChild('#container');
        for (const child of container.children) {
            child.onclick = event => {
                this.#onSelected(child.type);
            };
        }
    }

    /**
     * 
     * 设置选的项
     * 
     * @param {*} type 
     */
    setSelected(type) {
        const container = this.getChild('#container');
        for (const child of container.children) {
            if (child.type == type) {
                child.setAttribute('selected', 'true');
                break;
            }
        }
    }

    /**
     * 
     * 已经选择的icon
     * 
     * @param {*} type 
     */
    #onSelected(type) {

    }
}

CustomElementRegister(tagName, TweenSelector);
