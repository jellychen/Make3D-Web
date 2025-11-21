/* eslint-disable no-unused-vars */

import isFunction                  from 'lodash/isFunction';
import isString                    from 'lodash/isString';
import GlobalScope                 from '@common/global-scope';
import StopPointerEventPropagation from '@common/misc/stop-pointer-event-propagation';
import Cursor                      from '@assets/assets-cursor';
import ElementDomCreator           from './element-dom-creator';

/**
 * 唯一的id
 */
let tag_uid = 0;

/**
 * 元素的基类
 */
export default class Element extends HTMLElement {
    /**
     * ui相关的属性
     */
    #tag_name = '';
    #content;

    /**
     * shadow
     */
    #shadow;

    /**
     * 菜单事件的回调
     */
    #on_contextmenu;

    /**
     * 冒泡事件
     */
    #on_bubbles_event_type;
    #on_recv_bubbles_event = event => this.onRecvBubblesEvent(event);

    /**
     * Tips
     */
    #tips_manager

    /**
     * 获取随机唯一的tagName
     */
    static UniqueTag() {
        return `x-uid-${tag_uid++}`;
    }

    /**
     * 获取
     */
    get shadow() {
        return this.#shadow;
    }

    /**
     * 
     * 构造函数
     *
     * @param {*} name 
     */
    constructor(name) {
        super();
        this.#tag_name = name
        this.#on_contextmenu = event => {
            if (this.onCustomizeMenu(event)) {
                event.preventDefault();
            }
        };
    }

    /**
     * 
     * 获取tag名称
     * 
     * @returns 
     */
    tag() {
        return this.#tag_name;
    }

    /**
     * 
     * 从TPL中构建
     * 
     * @param {*} tpl 
     */
    createContentFromTpl(tpl) {
        const closed = !window.__ux_webcomponent_open__;
        this.#shadow = this.attachShadow({ mode: closed ? 'closed' : 'open' });
        this.#content = document.importNode(tpl.__dom__(), true);
        this.onCreate();
        this.#shadow.appendChild(this.#content);
    }

    /**
     * 
     * @param {*} guid 
     * @param {*} html 
     * @param {*} css 
     */
    createContent(guid, html, css) {
        const closed = !window.__ux_webcomponent_open__;
        this.#shadow = this.attachShadow({ mode: closed ? 'closed' : 'open' });
        this.#content = ElementDomCreator.createAndCache(guid, html, css);
        this.onCreate();
        this.#shadow.appendChild(this.#content);
    }

    /**
     * 构建函数
     */
    onCreate() { }

    /**
     * 清除全部的孩子
     */
    clearAllChildren() {
        const children = this.childNodes;
        while (children.length > 0) {
            children[0].remove();
        }
    }

    /**
     * 
     * 开启或者关闭自定义菜单
     * 
     * @param {Boolean} enable 
     */
    setEnableCustomizeMenu(enable) {
        if (true === enable) {
            this.addEventListener('contextmenu', this.#on_contextmenu);
        } else {
            this.removeEventListener('contextmenu', this.#on_contextmenu);
        }
    }

    /**
     * 获取支持的属性
     */
    static get observedAttributes() {
        return [
            "tips-placement", 
            "tips-data", 
            "tips-data-token", 
            "stop-pointer-event-propagation"
        ];
    }

    /**
     * 
     * 属性设置
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        if (name == 'tips-data') {
            this.setTipsTextData(_new);
        } else if (name == 'tips-data-token') {
            this.setTipsTextToken(_new);
        } else if (name == 'tips-placement') {
            this.setTipsPlacement(_new);
        } else if (name == 'stop-pointer-event-propagation') {
            this.stopPointerEventPropagation('true' === _new);
        }
    }

    /**
     * 
     * 设置当前的鼠标样式
     * 
     * @param {*} cursor 
     * @returns 
     */
    setCursor(cursor) {
        if (!isString(cursor)) {
            return;
        }

        const base64 = Cursor(cursor);
        if (!base64) {
            this.style.cursor = cursor;
        } else {
            this.style.cursor = `-webkit-image-set(url("${base64}") 2x) 4 4, auto`;
        }
    }

    /**
     * 
     * contentQuerySelector 的别名函数
     * 
     * @param {*} selectors 
     * @returns 
     */
    getChild(selectors) {
        return this.contentQuerySelector(selectors);
    }

    /**
     * 
     * 获取元素
     * 
     * @param {*} selectors 
     * @returns 
     */
    contentQuerySelector(selectors) {
        if (undefined == this.#content || null == this.#content) {
            return undefined;
        }
        return this.#content.querySelector(selectors);
    }

    /**
     * 
     * 分发事件
     * 
     * @param {*} event 
     */
    dispatchEvent(event) {
        super.dispatchEvent(event);
    }

    /**
     * 
     * 激发事件
     * 
     * @param {string} type 
     * @param {any} detail 
     */
    dispatchEventDetail(type, detail) {
        if (!isString(type)) {
            return;
        }
        this.dispatchEvent(new CustomEvent(type, {detail}));
    }

    /**
     * 
     * 分发自定义事件
     * 
     * @param {string} type 
     * @param {*} data 
     */
    dispatchUserDefineEvent(type, data) {
        const event = new Event(type);
        if (typeof data === 'object') {
            Object.assign(event, data);
        }
        this.dispatchEvent(event);
    }

    /**
     * 
     * 执行自定菜单，返回false执行默认操作
     * 
     * @param {*} event 
     * @returns 
     */
    onCustomizeMenu(event) {
        return true;
    }

    /**
     * 
     * 开启Tips
     * 
     */
    setEnableTips() {
        if (!this.#tips_manager) {
            this.#tips_manager = GlobalScope.createTipsManager(this);
        }
    }

    /**
     * 
     * 设置tips显示位置
     * 
     * @param {string} placement 
     */
    setTipsPlacement(placement) {
        if (!isString(placement)) {
            return;
        }
        this.setEnableTips(undefined);
        this.#tips_manager.setPlacement(placement);
    }

    /**
     * 
     * Tips
     * 
     * @param {string} data 
     */
    setTipsTextData(data) {
        if (!isString(data)) {
            return;
        }
        this.setEnableTips(undefined);
        this.#tips_manager.setTextData(data);
    }

    /**
     * 
     * Tips
     * 
     * @param {string} data 
     */
    setTipsTextToken(data) {
        if (!isString(data)) {
            return;
        }
        this.setEnableTips(undefined);
        this.#tips_manager.setTextToken(data);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        if (this.#tips_manager) {
            this.#tips_manager.attach();
        }
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        if (this.#tips_manager) {
            this.#tips_manager.detach();
        }
    }

    /**
     * 
     * 判断类型
     * 
     * @param {*} cls 
     * @returns 
     */
    is(cls) {
        return this instanceof (cls)
    }

    /**
     * 
     * 接收到冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        ;
    }

    /**
     * 
     * 监听孩子的冒泡事件
     * 
     * @param {string} type 
     */
    observerBubblesEvent(type = undefined) {
        this.removeEventListener(this.#on_bubbles_event_type, this.#on_recv_bubbles_event);
        this.#on_bubbles_event_type = type || '__bubbles__';
        this.addEventListener(this.#on_bubbles_event_type, this.#on_recv_bubbles_event);
    }

    /**
     * 
     * 冒泡一个事件
     * 
     * @param {*} data 
     * @param {*} type 
     */
    bubblesEvent(data = {}, type = undefined) {
        type = type || '__bubbles__';
        data = data || {};
        this.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail: data,
        }));
    }

    /**
     * 
     * 模拟一个任务
     * 
     * @param {function} callback 
     */
    nextTick(callback) {
        if (isFunction(callback)) {
            setTimeout(callback, 0);
        }
    }

    /**
     * 
     * 模拟下一帧任务
     * 
     * @param {function} callback 
     */
    nextFrameTick(callback) {
        if (isFunction(callback)) {
            requestAnimationFrame(callback);
        }
    }

    /**
     * 
     * 是否拦截事件
     * 
     * @param {boolean} enable 
     */
    stopPointerEventPropagation(enable) {
        StopPointerEventPropagation(this, true === enable);
    }
}
