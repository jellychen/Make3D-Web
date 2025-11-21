/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import Animation                from '@common/misc/animation';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Constants                from './constants';
import MatcapSelectorCell       from './v-cell';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-matcap-selector';

/**
 * Matcap 选择器
 */
export default class MatcapSelector extends Element {
    /**
     * 元素
     */
    #scrollable_container;
    #scrollable_container_content;

    /**
     * 外部回调
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
        this.#scrollable_container         = this.getChild('#scrollable-container');
        this.#scrollable_container_content = this.getChild('#scrollable-container-content');

        // 构建Cell
        for (const item of Constants) {
            const cell = new MatcapSelectorCell((thumb_url, url) => {
                if (isFunction(this.on_selected)) {
                    this.on_selected(thumb_url, url);
                }
            });
            cell.setUrl(item.url);
            cell.setThumbUrl(item.thumb_url);
            this.#scrollable_container_content.appendChild(cell);
        }
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 点击其他地方 消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.style.pointerEvents = 'none';
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, MatcapSelector);
