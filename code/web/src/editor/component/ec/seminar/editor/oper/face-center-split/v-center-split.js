/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import Animation                from '@common/misc/animation';
import ComputePosition          from '@common/misc/compute-position';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Html                     from './v-center-split-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-face-center-split';

/**
 * 用来设置顶点偏移
 */
export default class CenterSplit extends Element {
    /**
     * 元素
     */
    #offset;
    #btn_cancel;
    #btn_commit;

    /**
     * 事件回调
     */
    on_value_changed;
    on_cancel;
    on_commit;

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
        this.#offset                  = this.getChild('#numizer');
        this.#btn_cancel              = this.getChild('#cancel');
        this.#btn_commit              = this.getChild('#commit');
        this.#offset.on_value_changed = () => this.#onValueChanged();
        
        this.#btn_cancel.onclick = event => {
            if (isFunction(this.on_cancel)) {
                this.on_cancel();
            }
        };

        this.#btn_commit.onclick = event => {
            if (isFunction(this.on_commit)) {
                this.on_commit();
            }
        };
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
     * 值发生变化
     */
    #onValueChanged() {
        if (isFunction(this.on_value_changed)) {
            this.on_value_changed(this.#offset.value);
        }
    }

    /**
     * 移除，以动画的方式
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, CenterSplit);
