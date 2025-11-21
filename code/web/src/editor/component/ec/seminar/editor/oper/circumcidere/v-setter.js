/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import isNumber                 from 'lodash/isNumber';
import isString                 from 'lodash/isString';
import Animation                from '@common/misc/animation';
import ComputePosition          from '@common/misc/compute-position';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Html                     from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-editor-edge-circumcidere';

/**
 * 用来显示
 */
export default class Setter extends Element {
    /**
     * 元素
     */
    #container;
    #number;

    /**
     * 事件
     */
    on_changed;

    /**
     * 获取值
     */
    get count() {
        return this.#number.getValue();
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
        this.#container = this.getChild("#container");
        this.#number = this.getChild('#count');
        this.#number.addEventListener('changed', () => {
            if (isFunction(this.on_changed)) {
                this.on_changed(this.#number.getValue());
            }
        });
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent = undefined) {
        if (undefined == parent) {
            parent = document.body;
        }
        parent.appendChild(this);
    }

    /**
     * 
     * 设置数据
     * 
     * @param {*} count 
     */
    setCount(count) {
        this.#number.setValue(parseInt(count));
    }

    /**
     * 移除，以动画的方式
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Setter);
