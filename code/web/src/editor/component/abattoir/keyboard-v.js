/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import KeyboardObserver      from './keyboard-observer';
import Html                  from './keyboard-v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-keyboard';

/**
 * 用来显示键盘按钮的功能按键
 */
export default class KeyboardView extends Element {
    /**
     * 键盘监听
     */
    #keyboard_observer;

    /**
     * icon
     */
    #shift;
    #ctrl;
    #command;
    #option;

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
        this.#keyboard_observer = new KeyboardObserver();
        this.#keyboard_observer.onchanged = () => this.#onKeyboardChanged();
        this.#shift   = this.getChild('#shift');
        this.#ctrl    = this.getChild('#ctrl');
        this.#command = this.getChild('#command');
        this.#option  = this.getChild('#option');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#keyboard_observer.attach();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#keyboard_observer.dispose();
    }

    /**
     * 功能按键变化
     */
    #onKeyboardChanged() {
        this.setSelectedShift  (this.#keyboard_observer.pressedKey_Shift);
        this.setSelectedCtrl   (this.#keyboard_observer.pressedKey_Ctrl);
        this.setSelectedOption (this.#keyboard_observer.pressedKey_Alt);
        this.setSelectedCommand(this.#keyboard_observer.pressedKey_Meta);
    }

    /**
     * 
     * 设置Shift转态
     * 
     * @param {*} selected 
     */
    setSelectedShift(selected) {
        this.#shift.setSelected(selected);
    }

    /**
     * 
     * 设置Ctrl状态
     * 
     * @param {*} selected 
     */
    setSelectedCtrl(selected) {
        this.#ctrl.setSelected(selected);
    }

    /**
     * 
     * 设置Command状态
     * 
     * @param {*} selected 
     */
    setSelectedCommand(selected) {
        this.#command.setSelected(selected);
    }

    /**
     * 
     * 设置option状态
     * 
     * @param {*} selected 
     */
    setSelectedOption(selected) {
        this.#option.setSelected(selected);
    }
}

CustomElementRegister(tagName, KeyboardView);
