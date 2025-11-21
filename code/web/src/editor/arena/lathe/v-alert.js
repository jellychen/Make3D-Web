/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-alert-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-lathe-alert';

/**
 * 提示
 */
export default class Alert extends Element {
    /**
     * 元素
     */
    #container;
    #label;

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
        this.#label     = this.getChild('#label');
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Try(this.#container, {
            duration   : 300,
            easing     : 'out',
            translateY : [30, 0],
            opacity    : [0, 1],
            onComplete : () => {
                ;
            }
        });
    }

    /**
     * 
     * 设置
     * 
     * @param {*} token 
     */
    setTextToken(token) {
        this.#label.setTokenKey(token);
    }

    /**
     * 
     * 延迟关闭
     * 
     * @param {*} time 
     */
    deferClose(time = 1200) {
        setTimeout(() => {
            this.remove();
        }, time);
    }
}

CustomElementRegister(tagName, Alert);
