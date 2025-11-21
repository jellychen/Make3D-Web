/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMenu              from './v-loop-more-menu';
import Html                  from './v-loop-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-controller-loop';

/**
 * 循环的策略
 */
export default class Loop extends Element {
    /**
     * 元素
     */
    #data;
    #more;

    /**
     * 类型
     */
    #type = 'single';

    /**
     * 获取动画类型
     */
    get type() {
        return this.#type;
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#data = this.getChild('#text');
        this.#more = this.getChild('#more');
        this.#more.onclick = () => {
            ShowMenu(this.#more, token => {
                switch (token) {
                case 'single':
                    this.#data.innerText = 'Single';
                    break;

                case 'pingpong':
                    this.#data.innerText = 'Pingpong';
                    break;

                case 'loop':
                    this.#data.innerText = 'Loop';
                    break;

                case 'pingpong-loop':
                    this.#data.innerText = 'Pingpong Loop';
                    break;
                }
                this.#type = token;
            });
        };
    }
}

CustomElementRegister(tagName, Loop);