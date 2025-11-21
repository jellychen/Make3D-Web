/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import IconStatusSwitcher    from '../icon-status-switcher/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-status-switcher-container';

/**
 * 图标状态选择器
 */
export default class IconStatusSwitcherContainer extends Element {
    /**
     * 内部元素
     */
    #container;

    /**
     * Token
     */
    #token;

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
        this.#container.onclick = (event) => this.#onClick(event);
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "direction", 
                "gap" , 
                "enable"
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
        
        if ('direction' == name) {
            this.setDirection(_new);
        } else if ('gap' == name) {
            this.setGap(_new);
        } else if ('enable' == name) {
            this.setEnable('false' != _new);
        }
    }

    /**
     * 
     * 设置方向
     * 
     * row
     * row-reverse
     * column
     * column-reverse
     * 
     * @param {string} direction 
     */
    setDirection(direction) {
        if (isString(direction)) {
            this.#container.style.flexDirection = direction;
        }
    }

    /**
     * 
     * 设置Gap
     * 
     * @param {string|number} gap 
     */
    setGap(gap) {
        if (isNumber(gap)) {
            this.#container.style.gap = `${gap}px`;
        } else if (isString(gap)) {
            this.#container.style.gap = gap;
        }
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {*} enable 
     */
    setEnable(enable) {
        if (false === enable) {
            this.setAttribute('enable', 'false');
        } else {
            this.setAttribute('enable', 'true');
        }
    }

    /**
     * 
     * 选择
     * 
     * @param {*} element 
     */
    select(element) {
        if (!(element instanceof IconStatusSwitcher)) {
            return;
        }
        
        const slot = this.#container.querySelector('slot');
        const children = slot.assignedNodes({flatten: true});
        for (const child of children) {
            if (child == element) {
                child.setSelected(true);
            } else if (isFunction(child.setSelected)) {
                child.setSelected(false);
            }
        }
    }

    /**
     * 取消全部的选择
     */
    unselected() {
        const slot = this.#container.querySelector('slot');
        const children = slot.assignedNodes({flatten: true});
        for (const child of children) {
            if (isFunction(child.setSelected)) {
                child.setSelected(false);
            }
        }
    }

    /**
     * 
     * 点击事件
     * 
     * @param {*} event 
     */
    #onClick(event) {
        const current_target = event.target;
        if (!(current_target instanceof IconStatusSwitcher)) {
            return;
        }

        if (current_target.isSelected()) {
            return;
        }

        if (isFunction(current_target.setSelected)) {
            current_target.setSelected(true);
        }

        const slot = this.#container.querySelector('slot');
        const children = slot.assignedNodes({flatten: true});
        for (const child of children) {
            if (child != current_target) {
                if (!isFunction(child.setSelected)) {
                    continue
                }
                child.setSelected(false);
            }
        }

        // 变化
        this.#onChanged(current_target.getToken());
    }

    /**
     * 
     * 发送事件
     * 
     * @param {string} token 
     */
    #onChanged(token) {
        this.dispatchUserDefineEvent('changed', {
            token: token
        });
    }
}

CustomElementRegister(tagName, IconStatusSwitcherContainer);
