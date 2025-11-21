/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-drop-selector-item';

/**
 * 下拉项目
 */
export default class DropSelectorItem extends Element {
    /**
     * 父亲元素
     */
    #parent_selector;

    /**
     * 上下文
     */
    #context;

    /**
     * 元素
     */
    #container;
    #selected_icon;
    #icon;
    #text;

    /**
     * 可用性
     */
    #enable = true;

    /**
     * 有没有被选中
     */
    #selected = false;

    /**
     * 事件回调
     */
    #on_click_callback = (event) => this.#onClick(event);

    /**
     * 携带的数据
     */
    #token;

    /**
     * 获取数据
     */
    get token() {
        return this.#token;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} parent_selector 
     * @param {*} context 
     */
    constructor(parent_selector, context) {
        super(tagName);
        this.#parent_selector = parent_selector;
        this.#context = context;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#selected_icon = this.getChild('#selected');
        this.#text = this.getChild('#text');
        this.#icon = this.getChild('#icon');
    }

    /**
     * 当UI首次添加到DOM执行动画
     */
    connectedCallback() {
        super.connectedCallback();
        this.#container.addEventListener('pointerdown', this.#on_click_callback);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#container.removeEventListener('pointerdown', this.#on_click_callback);
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "token", 
                "icon", 
                'title-data', 
                'title-token', 
                'enable', 
                'selected'
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
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

        if ('token' == name) {
            this.setToken(_new);
        } else if ('title-data' == name) {
            this.setTextData(_new);
        } else if ('title-token' == name) {
            this.setTextToken(_new);
        } else if ('enable' == name) {
            this.setEnable('false' !== _new);
        } else if ('selected' == name) {
            this.setSelected('false' !== _new);
        }
    }

    /**
     * 
     * 设置数据
     * 
     * @param {Object} data 
     */
    setData(data) {
        data = data || {};

        // enable
        if (false === data.enable) {
            this.setEnable(false);
        } else {
            this.setEnable(true);
        }

        // icon
        if (data.icon) {
            this.setIcon(data.icon);
        }

        // token
        if (data.token) {
            this.setToken(data.token);
        }

        // text
        if (data.text_token) {
            this.setTextToken(data.text_token);
        } else if (data.text) {
            this.setTextData(data.text);
        }

        // selected
        if (true === data.selected) {
            this.setSelected(true);
        } else {
            this.setSelected(false);
        }
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {Boolean} value 
     */
    setEnable(value) {
        if (true === value) {
            if (this.#enable) {
                return;
            }
            this.#container.setAttribute("enable", "true");
            this.#enable = true;
        } else {
            if (!this.#enable) {
                return;
            }
            this.#container.setAttribute("enable", "false");
            this.#enable = false;
        }
    }

    /**
     * 
     * 设置Icon的显示关系
     * 
     * @param {Boolean} show 
     */
    setShowIcon(show = true) {
        if (true === show) {
            this.#icon.style.display = "block";
        } else {
            this.#icon.style.display = "none";
        }
    }

    /**
     * 
     * 设置Selected Icon的显示关系
     * 
     * @param {Boolean} show 
     */
    setHasSelectedIcon(show = true) {
        if (true === show) {
            this.#selected_icon.style.display = "block";
        } else {
            this.#selected_icon.style.display = "none";
        }
    }

    /**
     * 
     * 设置Icon
     * 
     * @param {string} icon 
     */
    setIcon(icon) {
        if (isString(icon)) {
            this.#icon.setSrc(icon);
        }
    }

    /**
     * 
     * 设置携带的数据
     * 
     * @param {any} data 
     */
    setToken(data) {
        this.#token = data;
    }

    /**
     * 
     * 设置文本内容
     * 
     * @param {string} data 
     */
    setTextData(data) {
        if (isString(data)) {
            this.#text.setData(data);
        }
    }

    /**
     * 
     * 设置文本内容Token
     * 
     * @param {String} data 
     */
    setTextToken(data) {
        if (isString(data)) {
            this.#text.setTokenKey(data);
        }
    }

    /**
     * 
     * 是否被选中
     * 
     * @returns 
     */
    isSelected() {
        return this.#selected;
    }

    /**
     * 
     * 设置有没有被选中
     * 
     * @param {Boolean} selected 
     */
    setSelected(selected) {
        if (true === selected) {
            this.#selected_icon.style.visibility = 'visible';
            this.#selected = true;
        } else {
            this.#selected_icon.style.visibility = 'hidden';
            this.#selected = false;
        }
    }

    /**
     * 
     * 点击事件
     * 
     * @param {*} event 
     */
    #onClick(event) {
        if (this.#context && this.#context.on_selected) {
            this.#context.on_selected(this.#token);
        }

        if (this.#parent_selector) {
            this.#parent_selector.dismiss();
        }

        // 冒泡事件
        this.bubblesEvent(this.#token);

        // 阻止事件继续冒泡
        event.stopPropagation();
    }
}

CustomElementRegister(tagName, DropSelectorItem);
