/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-processing-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-quadremesh-processing';

/**
 * 进度
 */
export default class Processing extends Element {
    /**
     * 全局的禁止mask
     */
    #forbidden_mask;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(false);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        this.#forbidden_mask = document.createElement('x-forbidden-mask');
        this.#forbidden_mask.setCursor('wait');
        document.body.append(this.#forbidden_mask);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#forbidden_mask) {
            this.#forbidden_mask.remove();
            this.#forbidden_mask = undefined;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#forbidden_mask) {
            this.#forbidden_mask.remove();
            this.#forbidden_mask = undefined;
        }
        this.remove();
    }
}

CustomElementRegister(tagName, Processing);
