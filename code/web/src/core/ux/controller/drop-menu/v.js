/* eslint-disable no-unused-vars */

import isArray               from 'lodash/isArray';
import isNumber              from 'lodash/isNumber';
import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DropMenuItem          from './v-item';
import DropMenuItemSeparator from './v-item-sparator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-drop-menu';

/**
 * 菜单
 */
export default class DropMenu extends Element {
    /**
     * 父menu
     */
    #parent_menu;
    #parent_menu_item;

    /**
     * 容器
     */
    #container;

    /**
     * context
     */
    #context;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

    /**
     * 子菜单, 子菜单属于哪个Item
     */
    #sub_menu;
    #sub_menu_item;

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
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');

        // 设置窗口风格
        if (this.#context.style === 'glass') {
            this.#container.setAttribute('window-style', 'glass');
        } else {
            this.#container.setAttribute('window-style', 'normal');
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
     * 设置父亲
     * 
     * @param {*} parent 
     */
    setParentMenu(parent) {
        this.#parent_menu = parent;
    }

    /**
     * 
     * 设置父亲
     * 
     * @param {*} parent_item 
     */
    setParentMenuItem(parent_item) {
        this.#parent_menu_item = parent_item;
    }

    /**
     * 
     * 获取父亲
     * 
     * @returns 
     */
    getParent() {
        return this.#parent_menu;
    }

    /**
     * 
     * 获取根节点
     * 
     * @returns 
     */
    getRoot() {
        if (!this.#parent_menu) {
            return this;
        }

        let current = this.#parent_menu;
        while (current) {
            let parent = current.getParent();
            if (!parent) {
                break;
            }
            current = parent;
        }

        return current;
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
        
        // 1. 统计是不是存在Item会显示Icon
        let has_item_icon = false;
        for (let i of data) {
            if (i.icon) {
                has_item_icon = true;
                break;
            }
        }

        // 2. 构建元素
        for (let i of data) {
            if (true === i.sparator) {
                this.#container.appendChild(new DropMenuItemSeparator());
            } else {
                let item = new DropMenuItem(this.#context);
                item.setParentMenu(this);
                item.setData(i);
                item.setIconVisible(has_item_icon);
                this.#container.appendChild(item);
            }
        }
    }

    /**
     * 显示
     */
    show() {
        document.body.appendChild(this);
    }

    /**
     * 摆放位置
     */
    placeLocation(x, y) {
        if (!isNumber(x)) x = 0;
        if (!isNumber(y)) y = 0;
        Object.assign(this.style, {
            left: `${x}px`,
            top:  `${y}px`,
        });
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
        if (isString(placement && isNumber(offset))) {
            if (reference_element) {
                ComputePosition(reference_element, this, placement, offset);
            }
        }
    }

    /**
     * 
     * 记录子菜单
     * 
     * @param {*} menu 
     * @param {*} item 
     */
    setSubmenu(menu, item) {
        this.dismissSubmenu();
        this.#sub_menu = menu;
        this.#sub_menu_item = item;
    }

    /**
     * 
     * 获取子菜单，如果存在
     * 
     * @returns 
     */
    getSubmenu() {
        return this.#sub_menu;
    }

    /**
     * 
     * 获取子菜单所属的Item
     * 
     * @returns 
     */
    getSubmenuItem() {
        return this.#sub_menu_item;
    }

    /**
     * 递归销毁子菜单
     */
    dismissSubmenu() {
        if (this.#sub_menu) {
            this.#sub_menu.dismiss(true);
            this.#sub_menu = undefined;
            this.#sub_menu_item = undefined;
        }
    }

    /**
     * 
     * 销毁
     * 
     * @param {Boolean} recursion 
     */
    dismiss(recursion = false) {
        if (recursion && this.#sub_menu) {
            this.dismissSubmenu();
        }

        // 判断是不是需要动画
        if (this.#context && this.#context.animation) {
            this.style.pointerEvents = 'none';
            Animation.Remove(this);
        } else {
            this.remove();
        }
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        if (this.#sub_menu) {
            return;
        }

        // 如果点击到了自己或者自己孩子直接忽视
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }

        // 如果点击到父亲，也忽视，交给entern和leave来处理
        if (this.#parent_menu) {
            if (this.#parent_menu == target ||
                this.#parent_menu.contains(target)) {
                    return;
                }
        }
        
        // 执行销毁操作
        this.getRoot().dismiss(true);

        // 回调
        if (this.#context && this.#context.on_cancle) {
            this.#context.on_cancle();
        }
    }
}

CustomElementRegister(tagName, DropMenu);
