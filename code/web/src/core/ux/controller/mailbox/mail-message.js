/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './mail-message-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-mail-message';

/**
 * Mail
 */
export default class MailMessage extends Element {
    /**
     * 元素
     */
    #container;
    #close;
    #text;

    /**
     * 关闭的定时器
     */
    #close_timer;

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
        this.#container = this.getChild('#container');
        this.#close     = this.getChild('#close');
        this.#text      = this.getChild('#text');
        this.#close.onclick = () => this.#onClose();
    }

    /**
     * 
     * 设置类型 default / success / fail
     * 
     * @param {String} type 
     */
    setType(type) {
        if ('success' === type || 'info' === type) {
            this.#container.setAttribute('type', 'success');
        } else if ('fail' === type || 'error' == type) {
            this.#container.setAttribute('type', 'fail');
        } else if ('warn' === type) {
            this.#container.setAttribute('type', 'warn');
        } else {
            this.#container.setAttribute('type', 'info');
        }
    }

    /**
     * 原生文本数据
     */
    setContentRaw(data) {
        if (isString(data)) {
            this.#text.setRaw(data);
        }
    }

    /**
     * 文本数据的Token
     */
    setContentDataTokenKey(key) {
        if (isString(key)) {
            this.#text.setTokenKey(key);
        }
    }

    /**
     * 
     * 关闭
     * 
     * @param {Boolean} animation 
     */
    close(animation = false) {
        this.resetDeferClose();
        if (true === animation) {
            this.#onClose();
        } else {
            this.remove();
        }
    }

    /**
     * 
     * 定时延迟删除自己
     * 
     * @param {Number} timeout_ms 
     * @param {Boolean} animation 
     */
    deferClose(timeout_ms, animation = true) {
        if (isNumber(timeout_ms)) {
            this.resetDeferClose();
            this.#close_timer = setTimeout(() => {
                this.close(true === animation);
            }, timeout_ms);
        }
    }

    /**
     * 清楚延迟关闭
     */
    resetDeferClose() {
        if (this.#close_timer) {
            clearTimeout(this.#close_timer);
            this.#close_timer = undefined;
        }
    }

    /**
     * 关闭回调
     */
    #onClose() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, MailMessage);
