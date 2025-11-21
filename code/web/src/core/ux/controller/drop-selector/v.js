/* eslint-disable no-unused-vars */

import isArray                   from 'lodash/isArray';
import isString                  from 'lodash/isString';
import isNumber                  from 'lodash/isNumber';
import Animation                 from '@common/misc/animation';
import ComputePosition           from '@common/misc/compute-position';
import CustomElementRegister     from '@ux/base/custom-element-register';
import Element                   from '@ux/base/element';
import ElementDomCreator         from '@ux/base/element-dom-creator'
import DropSelectorItem          from './v-item';
import DropSelectorItemSeparator from './v-item-sparator';
import Html                      from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-drop-selector';

/**
 * 下拉选择器
 */
export default class DropSelector extends Element {
    /**
     * 上下文
     */
    #context;

    /**
     * 元素
     */
    #container;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     */
    constructor(context) {
        super(tagName);
        this.#context = context;
        this.createContentFromTpl(tpl);
        this.observerBubblesEvent();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#container.onclick = (event) => event.stopPropagation();
        this.#container.onpointerdown = (event) => event.stopPropagation();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);

        // 执行动画
        this.style.opacity = 0;
        Animation.FadeIn(this);
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
     * 设置数据
     * 
     * @param {Object} data 
     */
    setData(data) {
        if (!isArray(data)) {
            throw new Error("data must be array");
        }

        // 1.  统计是不是存在Item会显示Icon和selected
        let has_item_icon = false;
        let has_item_selected_icon = false;
        for (let i of data) {
            if (i.separator) {
                continue;
            }

            if (i.icon) {
                has_item_icon = true;
            }

            if (true === i.selected) {
                has_item_selected_icon = true;
            }
        }

        // 2. 构建元素
        for (let i of data) {
            // 分割线
            if (i.separator) {
                let item = new DropSelectorItemSeparator();
                this.#container.appendChild(item);
            } 
            
            // item
            else {
                let item = new DropSelectorItem(this);
                item.setData(i);
                item.setHasSelectedIcon(has_item_selected_icon);
                item.setShowIcon(has_item_icon);
                this.#container.appendChild(item);
            }
        }
    }

    /**
     * 
     * 设置样式
     * 
     * @param {string} style 
     */
    setStyle(style) {
        if ('glass' === style) {
            this.#container.setAttribute('window-style', 'glass');
        } else {
            this.#container.setAttribute('window-style', 'normal');
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent_node 
     */
    show(parent_node) {
        parent_node.appendChild(this);
    }

    /**
     * 
     * 动态摆放
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    place(reference_element, placement = "auto", offset = 0) {
        if (isString(placement) && isNumber(offset)) {
            if (reference_element) {
                ComputePosition(reference_element, this, placement, offset);
            }
        }
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }

    /**
     * 
     * 接收到孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        super.onRecvBubblesEvent(event);
        if (this.#context && this.#context.on_selected) {
            this.#context.on_selected(event.detail);
        }
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        
        // 移除
        this.dismiss();
    }
}

CustomElementRegister(tagName, DropSelector);
