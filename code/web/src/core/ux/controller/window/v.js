/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import Moveable              from '@common/misc/moveable';
import ComputePosition       from '@common/misc/compute-position';
import AbsoluteLocation      from '@common/misc/absolute-location';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import Progress              from '@ux/controller/progress-infinite/v';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-window';

/**
 * 模拟一个窗口
 */
export default class Window extends Element {
    /**
     * 元素
     */
    #container;
    #header;
    #title;
    #close_btn;
    #content;

    /**
     * 事件回调
     */
    #on_close_callback;

    /**
     * 可移动
     */
    #moveable;

    /**
     * 事件回调
     */
    #on_move_begin  = () => this.#onMoveBegin();
    #on_move_finish = () => this.#onMoveFinish();

    /**
     * @param {string} data
     */
    set title(data) {
        if (isString(data)) {
            this.setTitle(data);
        }
    }

    /**
     * @param {string} token
     */
    set titleToken(token) {
        this.setTitleToken(token);
    }

    /**
     * @param {any} value
     */
    set closeable(value) {
        this.setCloseable(value);
    }

    /**
     * 
     * 设置关闭的回调函数
     * 
     * @param {function} callback
     */
    set onclose(callback) {
        if (isFunction(callback)) {
            this.#on_close_callback = callback;
        } else {
            this.#on_close_callback = undefined;
        }
    }

    /**
     * 
     * 获取关闭的回调函数
     * 
     */
    get onclose() {
        return this.#on_close_callback;
    }

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
        this.#header    = this.getChild('#header');
        this.#title     = this.getChild('#title');
        this.#content   = this.getChild('#content');
        this.#close_btn = this.getChild('#close-btn');
        this.#close_btn.onclick = () => this.dismiss(true);  
    }

    /**
     * 元素添加到DOM上面的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 可移动
        this.#moveable = new Moveable(this, this.parentNode, this.#header);
        this.#moveable.addEventListener('move-begin', this.#on_move_begin);
        this.#moveable.addEventListener('move-finish', this.#on_move_finish);
        this.#moveable.attach();
    }

    /**
     * 元素从Dom上面移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#moveable.detach();
    }

    /**
     * 属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "closeable", "title", "title-token"
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

        if ('closeable' == name) {
            this.setCloseable('false' != _new);
        } else if ('title' == name) {
            this.setTitle(_new);
        } else if ('title-token' == name) {
            this.setTitleToken(_new)
        }
    }

    /**
     * 窗体被拖动开始
     */
    #onMoveBegin() {
        this.#container.classList.add("moving");
    }

    /**
     * 窗体被拖动结束
     */
    #onMoveFinish() {
        this.#container.classList.remove("moving");
    }

    /**
     * 
     * 设置窗口风格
     * 
     * 1. normal
     * 2. glass
     * 
     * @param {String} style 
     */
    setWindowStyle(style) {
        this.#container.setAttribute('window-style', style);
    }

    /**
     * 设置标题
     * 
     * @param {string} data 
     */
    setTitle(data) {
        if (isString(data)) {
            this.#title.setData(data);
        }
    }

    /**
     * 
     * 设置标题
     * 
     * @param {string} token 
     */
    setTitleToken(token) {
        if (isString(token)) {
            this.#title.setTokenKey(token);
        }
    }

    /**
     * 设置是不是具备关闭按钮
     * 
     * @param {boolean} value 
     */
    setCloseable(value) {
        if (true === value) {
            if (this.#close_btn.classList.contains('hidden')) {
                this.#close_btn.classList.remove('hidden');
            }
        } else {
            if (!this.#close_btn.classList.contains('hidden')) {
                this.#close_btn.classList.add('hidden');
            }
        }
    }

    /**
     * 移除全部的内容
     */
    removeAllContent() {
        while (this.#content.hasChildNodes()) {
            this.#content.removeChild(this.#content.lastChild);
        }
    }

    /**
     * 设置显示加载
     */
    setContentLoading() {
        this.removeAllContent();
        let progress = new Progress();
        progress.classList.add('loading');
        this.#content.appendChild(progress);
    }

    /**
     * 
     * 设置窗体的内容
     * 
     * @param {*} content 
     */
    setContent(content) {
        this.removeAllContent();
        this.#content.appendChild(content);
    }

    /**
     * 
     * 内容末尾插入
     * 
     * @param {*} content 
     */
    appendContent(content) {
        this.#content.appendChild(content);
    }

    /**
     * 居中显示
     */
    moveToScreenCenter() {
        const document_client_w = document.body.offsetWidth;
        const document_client_h = document.body.offsetHeight;
        this.style.left = (document_client_w - this.offsetWidth) / 2 + 'px';
        this.style.top = (document_client_h - this.offsetHeight) / 2 + 'px';
    }

    /**
     * 
     * 移动到指定元素的附近
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    moveTo(reference_element, placement, offset = 10) {
        if (isString(placement) && isNumber(offset)) {
            ComputePosition(reference_element, this, placement, offset);
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} animation 
     * @param {*} parent_node 
     * @returns 
     */
    show(animation, parent_node = undefined) {
        if (this.parentNode) {
            return;
        }

        parent_node = parent_node || document.body;
        parent_node.appendChild(this);

        // 执行动画
        if (true === animation) {
            Animation.FadeIn(this);
        }
    }

    /**
     * 隐藏元素
     */
    dismiss(animation) {
        if (!this.parentNode) {
            return;
        }
        
        if (true === animation) {
            Animation.Remove(this);
        } else {
            this.remove();
        }

        // 事件分发
        this.dispatchUserDefineEvent('closed', { });

        // 函数回调
        if (this.#on_close_callback) {
            this.#on_close_callback();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        return this.dismiss();
    }
}

CustomElementRegister(tagName, Window);
