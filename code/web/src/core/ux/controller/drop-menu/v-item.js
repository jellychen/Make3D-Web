/* eslint-disable no-unused-vars */

import isArray               from 'lodash/isArray';
import isNumber              from 'lodash/isNumber';
import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-item-tpl.html';
import DropMenu              from './v';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-drop-menu-item';

/**
 * 下拉菜单
 */
export default class DropMenuItem extends Element {
    /**
     * context
     */
    #context;

    /**
     * 父menu
     */
    #parent_menu;

    /**
     * 元素
     */
    #container;
    #icon;
    #text;
    #more_icon;

    /**
     * 代表外部设置的token
     */
    #token;

    /**
     * 点击回调
     */
    #on_click_callback;

    /**
     * 孩子元素
     */
    #data_children;
    #data_children_count = 0;

    /**
     * 事件回调
     */
    #on_pointer_enter = () => this.#onPointerEnter();
    #on_pointer_leave = () => this.#onPointerLeave();
    
    /**
     * 
     * 设置Icon
     * 
     * @param {string} value
     */
    set icon(value) {
        this.setIcon(value);
    }

    /**
     * @param {boolean} value
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 设置 token
     */
    set token(value) {
        this.setToken(value);
    }

    /**
     * 获取 token
     */
    get token() {
        return this.#token;
    }

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
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#icon      = this.getChild('#icon');
        this.#text      = this.getChild('#text');
        this.#more_icon = this.getChild('#more');
        this.#container.onclick = () => this.#onClick();
    }

    /**
     * 当UI首次添加到DOM执行动画
     */
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('pointerenter', this.#on_pointer_enter);
        this.addEventListener('pointerleave', this.#on_pointer_leave);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('pointerenter', this.#on_pointer_enter);
        this.removeEventListener('pointerleave', this.#on_pointer_leave);
    }

    /**
     * 
     * 设置父亲
     * 
     * @param {*} parent 
     */
    setParentMenu(parent) {
        this.#parent_menu = parent;
    }

    /**
     * 
     * 设置数据
     * 
     * @param {*} data 
     */
    setData(data) {
        data = data || {};

        // icon
        if (data.icon) {
            this.setIcon(data.icon);
        }

        // text
        if (data.text_token) {
            this.#text.setTokenKey(data.text_token);
        } else if (data.text) {
            this.#text.setData(data.text);
        }

        // 可用性
        if (false === data.enable) {
            this.setEnable(false);
        } else {
            this.setEnable(true);
        }

        // 点击回调
        if (data.on_click) {
            this.#on_click_callback = data.on_click;
        }

        // token
        if (undefined !== data.token) {
            this.#token = data.token;
        }

        // 孩子
        if (data.children) {
            this.#data_children = data.children;
        }

        // 判断是不是存在
        if (isArray(this.#data_children)) {
            this.#data_children_count = this.#data_children.length;
        }

        if (this.#data_children_count > 0) {
            this.#more_icon.style.display = "auto";
        } else {
            this.#more_icon.style.display = "none";
        }
    }

    /**
     * 
     * 设置图标的可见性
     * 
     * @param {Boolean} visible 
     */
    setIconVisible(visible) {
        if (true === visible) {
            this.#icon.style.display = "auto";
        } else {
            this.#icon.style.display = "none";
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
            if (this.#icon) {
                this.#icon.setIcon(icon);
            }
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
            this.#container.setAttribute("enable", "true");
        } else {
            this.#container.setAttribute("enable", "false");
        }
    }

    /**
     * 
     * 设置 token
     * 
     * @param {Number|String} value 
     */
    setToken(value) {
        if (isNumber(value) || isString(value)) {
            this.#token = value;
        }
    }

    /**
     * 点击事件
     */
    #onClick() {
        // 通知到自己的回调函数 
        if (this.#on_click_callback) {
            this.#on_click_callback(this.#token);
        }

        // 如果没有孩子
        if (this.#data_children_count == 0) {
            if (this.#context &&this.#context.on_selected) {
                this.#context.on_selected(this.#token);
            }

            // 销毁
            this.#parent_menu.getRoot().dismiss(true);
        }
    }

    /**
     * 
     * 获取所属的menu
     * 
     * @returns 
     */
    getDropMenu() {
        if (this.#parent_menu) {
            return this.#parent_menu;
        }
    }

    /**
     * 鼠标进入
     */
    #onPointerEnter() {
        // 如果存在销毁之前的子菜单
        let parent_menu = this.getDropMenu();

        // 如果已经构建了子菜单，复用已经创建的菜单
        if (parent_menu.getSubmenuItem() !== this) {
            parent_menu.dismissSubmenu();
        } else {
            parent_menu.getSubmenu().dismissSubmenu();
            return;
        }

        // 存在孩子，构建子菜单
        if (this.#data_children_count > 0) {
            let menu = new DropMenu(this.#context);
            menu.setParentMenu(this.#parent_menu);
            menu.setParentMenuItem(this);
            menu.setData(this.#data_children);
            menu.show();
            menu.place(this, 'right-start', -5);
            parent_menu.setSubmenu(menu, this);
        }
    }

    /**
     * 鼠标移出
     */
    #onPointerLeave() {
        
    }
}

CustomElementRegister(tagName, DropMenuItem);
