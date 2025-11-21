/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-animation-icon-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-icon';

/**
 * 事件类型 icon
 */
export default class AnimationIcon extends Element {
    /**
     * 元素
     */
    #svg;

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
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "type", 
                "color",
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
        
        if ('type' == name) {
            this.setType(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        }
    }

    /**
     * 
     * 设置类型
     * 
     * @param {*} type 
     */
    setType(type) {
        switch(type) {
        case 't':
        case 'translate':
            this.#svg.setIcon('ani/t.svg');
            break;
        
        case 'r':
        case 'rotate':
            this.#svg.setIcon('ani/r.svg');
            break;

        case 's':
        case 'scale':
            this.#svg.setIcon('ani/s.svg');
            break;

        case 'k':
        case 'keyframe':
            this.#svg.setIcon('ani/k.svg');
            break;
        }
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#svg.setColor(color);
    }
}

CustomElementRegister(tagName, AnimationIcon);
