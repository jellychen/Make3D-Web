/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-tips';

/**
 * 小提示
 */
export default class Tips extends Element {
    /**
     * 元素
     */
    #container;
    #text;

    /**
     * tips
     */
    #placement = 'auto';

    /**
     * 当下正在执行的动画
     */
    #current_animation;

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
        this.#text = this.getChild('#text');
    }

    /**
     * 
     * 设置内容
     * 
     * @param {string} data 
     */
    setTextData(data) {
        if (!isString(data)) {
            return;
        }
        this.#text.setData(data);
    }

    /**
     * 
     * 设置内容
     * 
     * @param {string} token 
     */
    setTextToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#text.setTokenKey(token);
    }

    /**
     * 
     * 设置位置
     * 
     * 'auto'
     * 
     * 'top'
     * 'top-start'
     * 'top-end'
     * 'right'
     * 'right-start'
     * 'right-end'
     * 'bottom'
     * 'bottom-start'
     * 'bottom-end'
     * 'left'
     * 'left-start'
     * 'left-end'
     * 
     * @param {string} placement 
     */
    setPlacement(placement) {
        if (isString(placement)) {
            this.#placement = placement;
        }
    }

    /**
     * 语言可能发生变化
     */
    langMaybeChanged() {
        if (this.#text) {
            this.#text.langMaybeChanged();
        }
    }

   /**
    * 
    * 添加元素到指定的元素上面
    * 
    * @param {*} parent_node 
    * @param {*} relative_node 
    * @param {*} animation 
    */
    show(relative_node, animation = false) {
        document.body.appendChild(this);
    
        if (this.#current_animation) {
            this.#current_animation.remove(this);
            this.#current_animation = undefined;
        }

        if (animation) {
            this.style.opacity = 0;
            Animation.Try(
                this,
                {
                    opacity: 1,
                    duration: 300,
                    easing: 'easeOutCubic',
                    onComplete: () => {
                        this.#current_animation = undefined;
                    }
                });
        }

        if (relative_node) {
            ComputePosition(relative_node, this, this.#placement);
        }
    }

    /**
     * 
     * 移除
     * 
     * @param {boolean} animation 
     */
    dismiss(animation = true) {
        if (!this.parentNode) {
            return;
        }

        if (this.#current_animation) {
            this.#current_animation.remove(this);
            this.#current_animation = undefined;
        }

        if (true === animation) {
            Animation.Try(
                this,
                {
                    opacity: 0,
                    duration: 300,
                    easing: 'easeOutCubic',
                    onComplete: () => {
                        this.remove();
                        this.#current_animation = undefined;
                    }
                });
        } else {
            this.remove();
        }
    }
}

CustomElementRegister(tagName, Tips);
