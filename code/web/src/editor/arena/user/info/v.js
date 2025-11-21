/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ModelUser             from '@editor/dao/model/user';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-user-info';

/**
 * 显示用户的属性
 */
export default class Info extends Element {
    /**
     * 元素
     */
    #avatar;
    #name;
    #id;
    #email;
    #create_time;
    #vip;
    #close_btn;

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
        this.#avatar      = this.getChild('#avatar');
        this.#name        = this.getChild('#name');
        this.#id          = this.getChild('#id');
        this.#email       = this.getChild('#email');
        this.#create_time = this.getChild('#create_time');
        this.#vip         = this.getChild('#vip');
        this.#close_btn   = this.getChild('#close-btn');
        this.#close_btn.onclick = () => {
            Animation.Try(this, {
                opacity   : [1, 0],
                translateX: [0, -60],
                duration  : 300,
                easing    : 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                }
            });
        };
        this.update();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Try(this, {
            opacity   : [0, 1],
            translateX: [-60, 0],
            duration  : 300,
            easing    : 'easeOutCubic',
        });
    }

    /**
     * 
     * 日期
     * 
     * @param {*} unix_timestamp 
     * @returns 
     */
    #formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
    }

    /**
     * 更新数据
     */
    update() {
        this.#avatar.setSrc(ModelUser.image);
        this.#name.textContent        = ModelUser.name;
        this.#id.textContent          = ModelUser.uid;
        this.#email.textContent       = ModelUser.email;
        this.#create_time.textContent = this.#formatDate(ModelUser.create_at);
        this.#vip.textContent         = this.#formatDate(ModelUser.vip_deadline);
    }
}

CustomElementRegister(tagName, Info);
