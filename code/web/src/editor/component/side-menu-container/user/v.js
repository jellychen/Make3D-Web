/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowUserInfo          from '@editor/arena/user/info';
import ModelUser             from '@editor/dao/model/user';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-user';

/**
 * 用户数据
 */
export default class User extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 元素
     */
    #avatar;
    #user_notifer_dot;
    #subscriber;

    /**
     * 
     * 事件回调
     * 
     * @returns 
     */
    #on_user_changed = () => this.#onUserChanged();

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
        this.#container        = this.getChild('#container');
        this.#avatar           = this.getChild('#avatar');
        this.#user_notifer_dot = this.getChild('#user-notifer-dot');
        this.#subscriber       = this.getChild('#subscriber');
        this.#avatar.onclick = () => this.#onClickAvatar();
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#avatar.showLoading(true);
        ModelUser.addEventListener('changed', this.#on_user_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        ModelUser.removeEventListener('changed', this.#on_user_changed);
    }

    /**
     * 用户的信息发生变化
     */
    #onUserChanged() {
        this.#avatar.showLoading(false);
        this.#avatar.setSrc(ModelUser.image);
        this.#subscriber.setEnableVip(ModelUser.vip);
    }

    /**
     * 点击头像
     */
    #onClickAvatar() {
        ShowUserInfo(this.#avatar, 10, 'right-start');
    }
}

CustomElementRegister(tagName, User);
