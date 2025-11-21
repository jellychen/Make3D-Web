/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './events-icon-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-events-icon';

/**
 * 事件类型 icon
 */
export default class EventsIcon extends Element {
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
        case 'loaded':
            this.#svg.setIcon('event/loaded.svg');
            break;

        case 'keydown':
            this.#svg.setIcon('event/key-down.svg');
            break;

        case 'keyup':
            this.#svg.setIcon('event/key-up.svg');
            break;

        case 'keypress':
            this.#svg.setIcon('event/key-press.svg');
            break;

        case 'pointer-down':
        case 'pointerdown':
            this.#svg.setIcon('event/pointer-down.svg');
            break;

        case 'pointer-hover':
        case 'pointerhover':
            this.#svg.setIcon('event/pointer-hover.svg');
            break;

        case 'pointer-up':
        case 'pointerup':
            this.#svg.setIcon('event/pointer-up.svg');
            break;

        case 'pointer-click':
        case 'pointerclick':
            this.#svg.setIcon('event/pointer-click.svg');
            break;

        case 'resize':
            this.#svg.setIcon('event/resize.svg');
            break;

        case 'scroll':
            this.#svg.setIcon('event/scroll.svg');
            break;

        case 'timer':
            this.#svg.setIcon('event/timer.svg');
            break;

        case 'trigger':
            this.#svg.setIcon('event/trigger.svg');
            break;
        
        case 'user-define':
        case 'userdefine':
            this.#svg.setIcon('event/user-define.svg');
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

CustomElementRegister(tagName, EventsIcon);
