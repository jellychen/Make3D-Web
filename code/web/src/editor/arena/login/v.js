/* eslint-disable no-unused-vars */

import isFunction             from 'lodash/isFunction';
import GlobalBroadcastChannel from '@common/global-broadcast-channel';
import Animation              from '@common/misc/animation';
import Auth                   from '@common/supabase/authentication';
import User                   from '@editor/dao/model/user';
import CustomElementRegister  from '@ux/base/custom-element-register';
import Element                from '@ux/base/element';
import ElementDomCreator      from '@ux/base/element-dom-creator';
import ImageSrc               from '@assets/images/picture/login-window.webp';
import ShowLoginBaned         from '../login-baned';
import Html                   from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-login';

/**
 * 登录窗口
 */
export default class Login extends Element {
    /**
     * 元素
     */
    #container;
    #img;
    #btns;
    #login_google;
    #login_figma;
    #login_twitter;
    #login_github;
    #loading;

    /**
     * 事件
     */
    on_success;
    on_fail;

    /**
     * 回调函数
     */
    #on_user_login_changed = () => this.#onUserLoginChanged();

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
        this.#container             = this.getChild('#container');
        this.#img                   = this.getChild('#img');
        this.#btns                  = this.getChild('#btns');
        this.#login_google          = this.getChild('#google');
        this.#login_figma           = this.getChild('#figma');
        this.#login_twitter         = this.getChild('#twitter');
        this.#login_github          = this.getChild('#github');
        this.#loading               = this.getChild('#loading-container');
        this.#login_google.onclick  = () => Auth.SignInPopupWindow('google');
        this.#login_figma.onclick   = () => Auth.SignInPopupWindow('figma');
        this.#login_twitter.onclick = () => Auth.SignInPopupWindow('twitter');
        this.#login_github.onclick  = () => Auth.SignInPopupWindow('github');
        this.#img.setSrc(ImageSrc);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        GlobalBroadcastChannel.addEventListener(
            'user-login-changed', this.#on_user_login_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        GlobalBroadcastChannel.removeEventListener(
            'user-login-changed', this.#on_user_login_changed);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent) {
        this.remove();
        parent = parent || document.body;
        parent.appendChild(this);
    }

    /**
     * 接受到登录的信息变化
     */
    async #onUserLoginChanged() {  
        this.#btns   .style.visibility = 'hidden';
        this.#loading.style.visibility = 'visible';
        if (await User.Refresh()) {
            await User.RefreshUseRecoder();
            this.dispose();

            if (isFunction(this.on_success)) {
                this.on_success();
            }
        } else {
            ShowLoginBaned();
            if (isFunction(this.on_fail)) {
                this.on_fail();
            }
        }
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(
            this,
            {
                opacity: 0,
                duration: 300,
                easing: 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                }
            }
        );
    }
}

CustomElementRegister(tagName, Login);
