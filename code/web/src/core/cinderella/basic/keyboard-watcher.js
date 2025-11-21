/* eslint-disable no-unused-vars */

import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 用来监控键盘的事件，用来标记状态
 */
export default class KeyboardWatcher extends EventDispatcher {
    /**
     * 功能键
     */
    #ctrl  = false;
    #alt   = false;
    #shift = false;
    #meta  = false;
    #space = false;
    
    /**
     * 键盘事件回调
     */
    #callback_keyboard_down  = event => this.#keyboardDown (event);
    #callback_keyboard_up    = event => this.#keyboardUp   (event);
    #callbakc_keyboard_press = evert => this.#keyboardPress(evert);

    /**
     * 判断 ctrl 是不是按下了
     */
    get ctrl() {
        return this.#ctrl;
    }

    /**
     * 判断 alt 是不是按下了
     */
    get alt() {
        return this.#alt;
    }

    /**
     * 判断 shift 是不是按下了
     */
    get shift() {
        return this.#shift;
    }

    /**
     * 判断 meta 是不是按下了
     */
    get meta() {
        return this.#meta;
    }

    /**
     * 判断
     */
    get alt_or_meta() {
        return this.#alt || this.#meta;
    }

    /**
     * 空格按键
     */
    get space() {
        return this.#space;
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 可用性
     * 
     * @param {Boolean} enable 
     */
    setEnable(enable) {
        if (enable) {
            window.addEventListener("keydown",    this.#callback_keyboard_down, true);
            window.addEventListener("keypress",   this.#callbakc_keyboard_press     );
            window.addEventListener("keyup",      this.#callback_keyboard_up        );
        } else {
            window.removeEventListener("keydown", this.#callback_keyboard_down, true);
            window.removeEventListener("keypress",this.#callbakc_keyboard_press     );
            window.removeEventListener("keyup",   this.#callback_keyboard_up        );
        }
    }

    /**
     * 
     * 键盘按下
     * 
     * @param {*} event 
     */
    #keyboardDown(event) {
        switch (event.code) {
        case 'Space':
            this.#space = true;
            break;
        }
        this.#updateCommandKey(event);
        this.dispatchEvent("keydown", event);
    }

    /**
     * 
     * @param {*} event 
     */
    #keyboardPress(event) {
        this.dispatchEvent("keypress", event);
    }

    /**
     * 
     * 键盘弹起
     * 
     * @param {*} event 
     */
    #keyboardUp(event) {
        switch (event.code) {
        case 'Space':
            this.#space = false;
            break;
        }
        this.#updateCommandKey(event);
        this.dispatchEvent("keyup", event);
    }

    /**
     * 
     * 更新功能按键
     * 
     * @param {*} event 
     */
    #updateCommandKey(event) {
        // 用来记录功能按键是否发生变化
        let command_key_changed = false;
        
        // Ctrl
        if (this.#ctrl != event.ctrlKey) {
            this.#ctrl  = event.ctrlKey;
            command_key_changed = true;
        }

        // Alt
        if (this.#alt != event.altKey) {
            this.#alt  = event.altKey;
            command_key_changed = true;
        }

        // Shift
        if (this.#shift != event.shiftKey) {
            this.#shift  = event.shiftKey;
            command_key_changed = true;
        }

        // Meta
        if (this.#meta != event.metaKey) {
            this.#meta  = event.metaKey;
            command_key_changed = true;
        }

        // 通知
        if (command_key_changed) {
            this.dispatchEvent("command-key-changed", {});
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
    }
}
