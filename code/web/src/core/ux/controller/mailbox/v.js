/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import MailMessage           from './mail-message';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-mailbox';

/**
 * 信息槽
 */
export default class MailBox extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 最多存放消息的数量
     */
    #max_messages_count = 5;

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
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "reverse"
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

        if ('reverse' === name) {
            this.setEnableReverse('false' != _new);
        }
    }

    /**
     * 
     * 设置反向
     * 
     * @param {Boolean} enable 
     */
    setEnableReverse(enable) {
        if (true === enable) {
            this.#container.style.flexDirection = "column-reverse";
        } else {
            this.#container.style.flexDirection = "column";
        }
    }

    /**
     * 
     * 发送一次消息
     * 
     * @param {Object} message 
     */
    postMessage(message) {
        if (!message) {
            return;
        }

        // 数量不能太多
        const children_count = this.#container.children.length;
        if (children_count > this.#max_messages_count) {
            this.#container.children[children_count - 1].remove();
        }

        // 添加Message
        const item = new MailMessage();

        // =======================================================
        // 类型
        // =======================================================
        if (message.type) {
            item.setType(message.type);
        }

        // =======================================================
        // 文本
        // =======================================================
        if (message.text_token) {
            item.setContentDataTokenKey(message.text_token);
        } else if (message.text) {
            item.setContentRaw(message.text);
        }

        // =======================================================
        // 延迟关闭
        // =======================================================
        if (message.defer_close_time) {
            item.deferClose(message.defer_close_time, true);
        }

        this.#container.appendChild(item);
    }
}

CustomElementRegister(tagName, MailBox);
