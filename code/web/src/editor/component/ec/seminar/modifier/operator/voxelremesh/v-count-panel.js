/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ComputePosition       from '@common/misc/compute-position';
import Html                  from './v-count-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-voxelremesh-count-panel';

/**
 * 数量
 */
export default class CountPanel extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 事件
     */
    on_selected;

    /**
     * 事件回调
     */
    #on_dismiss = event => this.#onDismiss(event);

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
        for (const child of this.#container.childNodes) {
            if (!child || !child.classList) {
                continue;
            }

            if (!child.classList.contains('item')) {
                continue;
            }

            child.onclick = event => {
                const count = parseInt(child.innerText);
                this.#onSelectSegmentsCount(count);
                Animation.Remove(this);
            };
        }
    }

    /**
     * 元素添加到DOM上面的回调
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 元素从Dom上面移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} ref_element 
     */
    show(ref_element) {
        document.body.appendChild(this);
        ComputePosition(ref_element, this, 'bottom', 5);
    }

    /**
     * 
     * 选中了段数
     * 
     * @param {*} count 
     */
    #onSelectSegmentsCount(count) {
        if (count <= 0) {
            return;
        }

        if (isFunction(this.on_selected)) {
            try {
                this.on_selected(count);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 
     * 消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, CountPanel);
