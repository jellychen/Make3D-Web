/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav';

/**
 * 导航条
 */
export default class Nav extends Element {
    /**
     * 元素
     */
    #x;
    #discord;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#x       = this.getChild('#x');
        this.#discord = this.getChild('#discord');
        this.#x.onclick = () => {
            window.open("https://x.com/make3d_online",'_blank');
        };

        this.#discord.onclick = () => {
            window.open("https://discord.gg/9kph75rv",'_blank');
        };
    }
}

CustomElementRegister(tagName, Nav);
