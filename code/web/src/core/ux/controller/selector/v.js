/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-selector';

/**
 * 下拉列表
 */
export default class Selector extends Element {
    /**
     * 元素
     */
    #icon;
    #label;
    #more;

    /**
     * item
     */
    #items;

    /**
     * 数据
     */
    #data;

    /**
     * 回调函数
     */
    on_data_changed;

    /**
     * 销毁
     */
    #on_dismiss_items = event => this.#onDismissItems(event);

    /**
     * 获取
     */
    get data() {
        return this.#data;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.observerBubblesEvent();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#icon  = this.getChild('#icon');
        this.#label = this.getChild('#label');
        this.#more  = this.getChild('#more');
        this.#items = this.getChild('#items');
        this.#more.onclick = event => this.#onClickMore(event);
        this.nextFrameTick(() => {
            const slot = this.#items.querySelector('slot');
            const eles = slot.assignedElements({ flatten: true });
            if (eles && eles.length > 0) {
                this.#copyInfoFromItem(eles[0]);
            }
        });
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss_items);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss_items);
    }

    /**
     * 
     * 拷贝数据
     * 
     * @param {*} item 
     */
    #copyInfoFromItem(item) {
        if (item) {
            this.#icon.setIcon(item.icon);
            this.#label.setToken(item.text);
            this.#data = item.data;
        }
    }

    /**
     * 
     * 点击更多
     * 
     * @param {*} event 
     */
    #onClickMore(event) {
        this.#items.style.display = 'flex';
        Animation.Try(this.#items, {
            duration   : 180,
            easing     : 'out',
            translateY : [10, 0],
            opacity    : [0, 1],
            onComplete : () => {
                ;
            }
        });
    }

    /**
     * 
     * 销毁
     * 
     * @param {*} event 
     */
    #onDismissItems(event) {
        const x = event.clientX;
        const y = event.clientY;
        const rect = this.#items.getBoundingClientRect();
        if (x > rect.left   &&
            x < rect.right  &&
            y > rect.top    &&
            y < rect.bottom) {
            return;
        }
        this.#dismissItems();
    }

    /**
     * 销毁
     */
    #dismissItems() {
        Animation.Try(this.#items, {
            duration   : 180,
            easing     : 'out',
            translateY : [0, 10],
            opacity    : [1, 0],
            onComplete : () => {
                this.#items.style.display = 'none';
            }
        });
    }

    /**
     * 
     * 接收孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        event.stopPropagation();
        super.onRecvBubblesEvent(event);
        const item = event.detail.item;
        if (!item) {
            return;
        }
        
        const old_data = this.#data;
        this.#copyInfoFromItem(item);
        if (this.#data == old_data) {
            return;
        }

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            data: this.#data
        });

        if (isFunction(this.on_data_changed)) {
            this.on_data_changed(this.#data);
        }

        // 销毁
        this.#dismissItems();
    }
}

CustomElementRegister(tagName, Selector);
