/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMenu              from './v-quality-menu';
import Html                  from './v-quality-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-quality';

/**
 * 用来控制渲染的质量
 */
export default class Quality extends Element {
    /**
     * 元素
     */
    #text;
    #more;

    /**
     * 事件回调
     */
    onchange;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.#text = this.getChild('#text');
        this.#more = this.getChild('#more');
        this.#more.onclick = () => {
            ShowMenu(this.#more, token => {
                switch (token) {
                case 'preview':
                    this.#text.setToken('rt.quality.preview');
                    break;

                case 'hd':
                    this.#text.setToken('rt.quality.hd');
                    break;

                case 'super':
                    this.#text.setToken('rt.quality.super');
                    break;

                case 'ultra':
                    this.#text.setToken('rt.quality.ultra');
                    break;

                case 'ultimate':
                    this.#text.setToken('rt.quality.ultimate');
                    break;
                }
                this.#onChange(token);
            });
        };
    }

    /**
     * 
     * 值发生了变化
     * 
     * @param {*} token 
     */
    #onChange(token) {
        if (isFunction(this.onchange)) {
            try {
                this.onchange(token);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, Quality);
