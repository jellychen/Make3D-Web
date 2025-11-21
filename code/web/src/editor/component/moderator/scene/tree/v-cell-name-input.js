/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import StopPointerEventPropagation from '@common/misc/stop-pointer-event-propagation';
import CustomElementRegister       from '@ux/base/custom-element-register';
import Element                     from '@ux/base/element';
import ElementDomCreator           from '@ux/base/element-dom-creator';
import Html                        from './v-cell-name-input.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene-tree-cell-name-input';

/**
 * 名称输入框
 */
export default class TreeCellNameInput extends Element {
    /**
     * 元素
     */
    #input;
    #clear;

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
        StopPointerEventPropagation(this, true);
        this.#input = this.getChild('#input');
        this.#clear = this.getChild('#clear');
        this.#input.addEventListener('keydown',     (event) => this.#onKeyDown   (event));
        this.#clear.addEventListener('pointerdown', (event) => this.#onClickClear(event));
    }

    /**
     * 获取值
     */
    get value() {
        return this.#input.value;
    }

    /**
     * 设置值
     */
    set value(data) {
        this.#input.value = data;
    }

    /**
     * 上焦点
     */
    setFocus() {
        this.#input.setFocus();
    }

    /**
     * 全选
     */
    selectAll() {
        this.#input.selectAll();
    }

    /**
     * 
     * 键盘
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        // 按下回车按键
        if (event.key === "Enter" || event.keyCode === 13) {
            // 发送事件
            this.dispatchUserDefineEvent('commit', {
                value: this.value
            });
        }
    }

    /**
     * 
     * 点击清空
     * 
     * @param {*} event 
     */
    #onClickClear(event) {
        // 防止input失去焦点
        event.preventDefault();
        this.#input.value = "";
    }
}

CustomElementRegister(tagName, TreeCellNameInput);
