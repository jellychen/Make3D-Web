/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tween-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-tween';

/**
 * 用来显示Tween动画的函数图像
 */
export default class Tween extends Element {
    /**
     * 图标
     */
    #icon;

    /**
     * 类型
     */
    #type;

    /**
     * 获取
     */
    get type() {
        return this.#type;
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
        this.#icon = this.getChild('#icon');
        this.setType('linear');
    }

    /**
     * 属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "type",
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
     * @returns 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('type' == name) {
            this.setType(_new);
        }
    }

    /**
     * 
     * 设置显示类型
     * 
     * @param {*} type 
     */
    setType(type) {
        switch(type) {
            case 'linear':
            case 'back-in-out':
            case 'back-in':
            case 'back-out':
            case 'bounce-in-out':
            case 'bounce-in':
            case 'bounce-out':
            case 'circular-in-out':
            case 'circular-in':
            case 'circular-out':
            case 'cubic-in-out':
            case 'cubic-in':
            case 'cubic-out':
            case 'elastic-in-out':
            case 'elastic-in':
            case 'elastic-out':
            case 'exponential-in-out':
            case 'exponential-in':
            case 'exponential-out':
            case 'quadratic-in-out':
            case 'quadratic-in':
            case 'quadratic-out':
            case 'quartic-in-out':
            case 'quartic-in':
            case 'quartic-out':
            case 'sinusoidal-in-out':
            case 'sinusoidal-in':
            case 'sinusoidal-out':
                this.#type = type;
                this.#icon.setIcon(`tween/${type}.svg`);
                break;
        }
    }
}

CustomElementRegister(tagName, Tween);
