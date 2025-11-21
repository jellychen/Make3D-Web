/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import GlobalScope           from '@common/global-scope';
import Notifier              from '@common/misc/notifier';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ModelUser             from '@editor/dao/model/user';
import SubscriberPanel       from './v-subscriber-panel';
import AccodeVerity          from './v-accode-verify';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-subscriber';

/**
 * 订阅服务
 */
export default class Subscriber extends Element {
    /**
     * 元素
     */
    #container;
    #content;

    /**
     * 事件回调
     */
    #on_pointer_enter = () => this.#onPointerEnter();
    #on_pointer_leave = () => this.#onPointerLeave();

    /**
     * 弹出 Panel
     */
    #panel;

    /**
     * 事件
     */
    #on_need_show_panel = () => this.#onNeedShowPanel();


    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#content   = this.getChild('#content');
        this.#container = this.getChild('#container');
        this.#container.addEventListener('pointerenter', this.#on_pointer_enter);
        this.#container.addEventListener('pointerleave', this.#on_pointer_leave);
        this.#container.addEventListener('click', event => this.showPanel());
    }

    /**
     * 
     * 开启 VIP 显示
     * 
     * @param {boolean} enable 
     */
    setEnableVip(enable) {
        if (enable) {
            this.#content.setSrc('ui/vip-highlight.svg');
        } else {
            this.#content.setSrc('ui/vip.svg');
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        Notifier.add('show-subscriber-panel', this.#on_need_show_panel);
        GlobalScope.showVipSubscriber = () => this.showPanel();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        Notifier.del('show-subscriber-panel', this.#on_need_show_panel);
        GlobalScope.showVipSubscriber = undefined;
    }

    /**
     * 
     * 显示
     * 
     * @returns 
     */
    showPanel() {
        if (this.#panel) {
            return;
        }
        this.#panel = new SubscriberPanel();
        this.#panel.setOnDismissCallback(() => this.#panel = undefined);
        this.#panel.position(this.#content, 'right-start');
        document.body.appendChild(this.#panel);
    }

    /**
     * 鼠标进入
     */
    #onPointerEnter() {
        
    }

    /**
     * 鼠标移出
     */
    #onPointerLeave() {
        
    }

    /**
     * 需要展示
     */
    #onNeedShowPanel() {
        this.showPanel();
    }
}

CustomElementRegister(tagName, Subscriber);
