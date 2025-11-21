/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from "@ux/base/element";
import ElementDomCreator     from "@ux/base/element-dom-creator";
import Html                  from "./v-tpl.html";
const tpl = ElementDomCreator.createTpl(Html);
const tagName = "x-switcher-icon";

/**
 * 二值选择
 */
export default class SwitcherIcon extends Element {
    /**
     * 元素
     */
    #icon;                  // 显示SVG的组件
    #icon_svg_checked;      // 选中时显示的SVG
    #icon_svg_unchecked;    // 未选中显示的SVG
    #on_changed_callback;   //
    #checked = false;

    /**
     * @param {boolean} value
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 获取组件是不是可用
     */
    get enable() {
        return "true" == this.#icon.getAttribute("enable");
    }

    /**
     * @param {boolean} value
     *
     * 设置是不是选中
     */
    set checked(value) {
        this.setChecked(value);
    }

    /**
     *
     * 获取是不是选中
     */
    get checked() {
        return this.#checked;
    }

    /**
     *
     * 设置值在变化的时候的回调函数
     *
     * @param {function} callback
     */
    set onchanged(callback) {
        this.setOnChangedCallback(callback);
    }

    /**
     * 获取回调函数
     */
    get onchanged() {
        return this.#on_changed_callback;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#icon = this.getChild("#icon");
        this.#icon.onpointerdown = () => {
            if (this.#checked) {
                this.setChecked(false);

                this.dispatchUserDefineEvent('changed', { checked: false });
            } else {
                this.setChecked(true);

                this.dispatchUserDefineEvent('changed', { checked: true });
            }
        };
    }

    /**
     * 获取支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "enable", 
                "checked", 
                "checked-icon", 
                "unchecked-icon"
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

        if ("enable" == name) {
            this.setEnable("true" == _new);
        } else if ("checked-icon" == name) {
            this.#icon_svg_checked = _new;
            this.updateIcon();
        } else if ("unchecked-icon" == name) {
            this.#icon_svg_unchecked = _new;
            this.updateIcon();
        } else if ("checked" == name) {
            this.setChecked("false" != _new);
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.#checked) {
            this.#icon.setIcon(this.#icon_svg_checked);
        } else {
            this.#icon.setIcon(this.#icon_svg_unchecked);
        }
    }

    /**
     *
     * 设置是不是可用
     *
     * @param {Boolean} enable
     */
    setEnable(enable) {
        if (true === enable) {
            this.#icon.setAttribute("enable", "true");
        } else {
            this.#icon.setAttribute("enable", "false");
        }
    }

    /**
     *
     * 设置是不是选中
     *
     * @param {boolean} value
     */
    setChecked(value) {
        if (!this.enable) {
            return;
        }

        const boolean = true === value;
        if (boolean == this.#checked) {
            return;
        }

        this.#checked = boolean;
        this.updateIcon();
    }

    /**
     * 更新Icon
     */
    updateIcon() {
        if (this.#checked) {
            this.#icon.setIcon(this.#icon_svg_checked);
        } else {
            this.#icon.setIcon(this.#icon_svg_unchecked);
        }
    }

    /**
     *
     * 设置状态变化后的回调
     *
     * @param {function} callback
     */
    setOnChangedCallback(callback) {
        if (isFunction(callback)) {
            this.#on_changed_callback = callback;
        } else {
            this.#on_changed_callback = undefined;
        }
    }
}

CustomElementRegister(tagName, SwitcherIcon);
