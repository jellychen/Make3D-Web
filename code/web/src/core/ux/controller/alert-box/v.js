/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-alert-box';

/**
 * 警告
 */
export default class AlertBox extends Element {
    /**
     * 元素
     */
    #container;
    #icon;
    #text;
    #close_button;

    /**
     * 关闭回调
     */
    #on_closed_callback;

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
        this.#container    = this.getChild("#container");
        this.#icon         = this.getChild("#icon");
        this.#text         = this.getChild('#text');
        this.#close_button = this.getChild('#btn');
        this.#close_button.onclick = () => {
            if (this.#on_closed_callback) {
                this.#on_closed_callback();
            }
            this.dismiss(true);
        };
    }

    /**
     * 当UI首次添加到DOM执行动画
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.FadeIn(this.#container);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 设置Icon显示/ success'|'info'|'warn'|'error'
     * 
     * @param {string} icon 
     */
    setStatusIcon(icon) {
        this.#icon.setValue(icon);
    }

    /**
     * 
     * 设置关闭的回调
     * 
     * @param {*} callback 
     */
    setCloseCallback(callback) {
        this.#on_closed_callback = callback;
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {string} data 
     */
    setTextData(data) {
        this.#text.setData(data);
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {string} token 
     */
    setTextToken(token) {
        this.#text.setToken(token);
    }

    /**
     * 显示
     */
    show() {
        this.remove();
        document.body.appendChild(this);
    }

    /**
     * 
     * 关闭
     * 
     * @param {Boolean} animation 
     */
    dismiss(animation = false) {
        if (!animation) {
            this.remove();
        } else {
            Animation.Remove(this);
        }
    }
}

CustomElementRegister(tagName, AlertBox);
