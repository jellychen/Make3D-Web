/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-occt-loader';

/**
 * OCCT 加载中
 */
export default class OcctLoader extends Element {
    /**
     * 元素
     */
    #container;

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
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.FadeIn(this.#container);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(this.#container, {
            opacity   : 0,
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, OcctLoader);
