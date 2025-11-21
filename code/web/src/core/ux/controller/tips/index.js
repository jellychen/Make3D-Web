/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString from 'lodash/isString';
import Tips     from "./v";

/**
 * Tips的管理器，主要完成延迟创建
 */
export default class TipsManager {
    /**
     * 宿主元素
     */
    #host_html_dom_element;

    /**
     * 实例和数据
     */
    #tips;
    #tips_placement = 'auto';
    #tips_text_data;
    #tips_text_token;

    /**
     * 事件回调
     */
    #on_pointer_enter = () => this.#onPointerEnter();
    #on_pointer_leave = () => this.#onPointerLeave();

    /**
     * 等待显示的timer
     */
    #wait_show_timer;

    /**
     * 构造函数
     */
    constructor(host_html_dom_element) {
        this.#host_html_dom_element = host_html_dom_element;
    }

    /**
     * 
     * 设置显示位置
     * 
     * @param {string} placement 
     */
    setPlacement(placement) {
        if (!isString(placement)) {
            return;
        }

        this.#tips_placement = placement;
        if (this.#tips) {
            this.#tips.setPlacement(this.#tips_placement);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {string} data 
     */
    setTextData(data) {
        if (!isString(data)) {
            return;
        }

        this.#tips_text_token = undefined;
        this.#tips_text_data = data;
        if (this.#tips) {
            this.#tips.setTextData(data);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {String} data 
     */
    setTextToken(data) {
        if (!isString(data)) {
            return;
        }
        
        this.#tips_text_token = data;
        this.#tips_text_data = undefined;
        if (this.#tips) {
            this.#tips.setTextToken(data);
        }
    }

    /**
     * 鼠标进入
     */
    #onPointerEnter() {
        if (this.#wait_show_timer) {
            ;
        } else {
            this.#wait_show_timer = setTimeout(() => {
                this.#wait_show_timer = undefined;
                this.#showTips();
            }, 500);
        }
    }

    /**
     * 鼠标移出
     */
    #onPointerLeave() {
        if (this.#wait_show_timer) {
            clearTimeout(this.#wait_show_timer);
            this.#wait_show_timer = undefined;
        }
        
        if (this.#tips) {
            this.#tips.dismiss(true);
            this.#tips = undefined;
        }
    }

    /**
     * 真正的执行显示
     */
    #showTips() {
        if (!this.#tips) {
            this.#tips = new Tips();
            this.#tips.setTextData(this.#tips_text_data);
            this.#tips.setTextToken(this.#tips_text_token);
            this.#tips.setPlacement(this.#tips_placement);
        } else {
            this.#tips.langMaybeChanged();
        }

        // 显示
        this.#tips.show(this.#host_html_dom_element, true);
        setTimeout(() => {
            if (this.#tips) {
                this.#tips.dismiss(true);
                this.#tips = undefined;
            }
        }, 3000);
    }

    /**
     * 挂接
     */
    attach() {
        this.#host_html_dom_element.addEventListener('pointerenter', this.#on_pointer_enter);
        this.#host_html_dom_element.addEventListener('pointerleave', this.#on_pointer_leave);
    }

    /**
     * 解挂
     */
    detach() {
        this.#host_html_dom_element.removeEventListener('pointerenter', this.#on_pointer_enter);
        this.#host_html_dom_element.removeEventListener('pointerleave', this.#on_pointer_leave);
    }
}
