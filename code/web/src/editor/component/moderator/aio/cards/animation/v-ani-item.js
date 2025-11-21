/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Icon                  from './v-animation-icon';
import ShowMenu              from './v-ani-item-more';
import EventEditor           from './event/editor-panel';
import ShowAniSetter         from './v-ani-setter';
import ShowConfigure         from './configure';
import AniSetterCreator      from './anime/creator';
import Status                from './v-status';
import Html                  from './v-ani-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-ani-item';

/**
 * 动画的一项
 */
export default class Item extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #icon;
    #title;
    #ani_more;
    #ani_setter;
    #enable;
    #show_menu;
    #status_setter_container;
    #status_setter;

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
        this.setAnimationType('k');
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container               = this.getChild('#container');
        this.#icon                    = this.getChild('#icon');
        this.#title                   = this.getChild('#title');
        this.#ani_more                = this.getChild('#animation-more');
        this.#ani_setter              = this.getChild('#ani-setter');
        this.#enable                  = this.getChild('#enable');
        this.#show_menu               = this.getChild('#header-more');
        this.#status_setter_container = this.getChild('#status-setter-container');
        this.#ani_more.onclick   = () => ShowAniSetter(this.#ani_more,   token => {});
        this.#ani_setter.onclick = () => ShowConfigure(this.#ani_setter);
        this.#show_menu.onclick  = () => ShowMenu(this.#show_menu, token => this.#onMenuCallback(token));
    }

    /**
     * 
     * 设置触发的时机
     * 
     * @param {*} event 
     */
    setTriggerEvent(event) {

    }

    /**
     * 
     * 设置动画的类型
     * 
     * @param {*} type 
     */
    setAnimationType(type) {
        if (this.#status_setter) {
            this.#status_setter.remove();
        }
        const setter = AniSetterCreator(type, this.#coordinator);
        this.#status_setter = setter;
        this.#status_setter_container.appendChild(setter);
    }

    /**
     * 
     * 菜单回调
     * 
     * @param {*} token 
     */
    #onMenuCallback(token) {
        switch(token) {
        case 'delete':
            Animation.Remove(this);
            break;
        }
    }
}

CustomElementRegister(tagName, Item);
