/* eslint-disable no-unused-vars */

import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 用来对键盘的按钮的监听记录
 */
export default class KeyboardObserver extends EventDispatcher {
    /**
     * 交互元素
     */
    #interactive;

    /**
     * 事件回调
     */
    #on_key_down;
    #on_key_up;

    /**
     * 标记功能按键
     */
    #key_pressed_ctrl;
    #key_pressed_meta;
    #key_pressed_alt;
    #key_pressed_shift;

    /**
     * 回调函数
     */
    #on_changed_callback = () => { };

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 监听
     */
    attach(interactive) {
        interactive = interactive || document.body;
        this.#interactive = interactive;
        this.#on_key_down = (e) => this.#onKeyDown(e);
        this.#on_key_up   = (e) => this.#onKeyUp(e);
        interactive.addEventListener('keydown', this.#on_key_down);
        interactive.addEventListener('keyup'  , this.#on_key_up);
    }

    /**
     * 
     * 键盘按下事件
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        this.#onCommandKeyMaybeChanged(event);
    }

    /**
     * 
     * 键盘抬起事件
     * 
     * @param {*} event 
     */
    #onKeyUp(event) {
        this.#onCommandKeyMaybeChanged(event);
    }

    /**
     * Meta
     */
    get pressedKey_Meta() {
        return this.#key_pressed_meta;
    }

    /**
     * Alt
     */
    get pressedKey_Alt() {
        return this.#key_pressed_alt;
    }

    /**
     * Ctrl
     */
    get pressedKey_Ctrl() {
        return this.#key_pressed_ctrl;
    }

    /**
     * Shift
     */
    get pressedKey_Shift() {
        return this.#key_pressed_shift;
    }

    /**
     * 对外通知事件
     */
    set onchanged(callback) {
        this.#on_changed_callback = callback;
    }

    /**
     * 对外通知事件
     */
    get onchanged() {
        return this.#on_changed_callback;
    }

    /**
     * 
     * 键盘
     * 
     * @param {*} event 
     */
    #onCommandKeyMaybeChanged(event) {
        // 标记是不是
        let command_key_changed = false;

        // alt 在mac下面就是 Opt 按键
        if (('altKey' in event) && event['altKey']) {
            if (this.#key_pressed_alt != true) {
                command_key_changed = true;
            }
            this.#key_pressed_alt = true;
        } else {
            if (this.#key_pressed_alt != false) {
                command_key_changed = true;
            }
            this.#key_pressed_alt = false;
        }

        // ctrl
        if (('ctrlKey' in event) && event['ctrlKey']) {
            if (this.#key_pressed_ctrl != true) {
                command_key_changed = true;
            }
            this.#key_pressed_ctrl = true;
        } else {
            if (this.#key_pressed_ctrl != false) {
                command_key_changed = true;
            }
            this.#key_pressed_ctrl = false;
        }

        // meta 就是 Command 按键
        if (('metaKey' in event) && event['metaKey']) {
            if (this.#key_pressed_meta != true) {
                command_key_changed = true;
            }
            this.#key_pressed_meta = true;
        } else {
            if (this.#key_pressed_meta != false) {
                command_key_changed = true;
            }
            this.#key_pressed_meta = false;
        }

        // shift
        if (('shiftKey' in event) && event['shiftKey']) {
            if (this.#key_pressed_shift != true) {
                command_key_changed = true;
            }
            this.#key_pressed_shift = true;
        } else {
            if (this.#key_pressed_shift != false) {
                command_key_changed = true;
            }
            this.#key_pressed_shift = false;
        }

        // 通知
        if (command_key_changed) {
            this.dispatchEvent("command-key-changed", {});
        }

        // callback
        if (this.#on_changed_callback) {
            this.#on_changed_callback(this);
        }
    }

    /**
     * 清理并解除对事件的监听
     */
    dispose() {
        this.#interactive.removeEventListener('keydown', this.#on_key_down);
        this.#interactive.removeEventListener('keyup'  , this.#on_key_up);
    }
}
