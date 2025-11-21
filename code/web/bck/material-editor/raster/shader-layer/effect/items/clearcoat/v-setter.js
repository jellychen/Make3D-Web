/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import SetterPanel           from '../../../receptacle/v-setter-panel';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer-clearcoat-setter';

/**
 * 设置器
 */
export default class Setter extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
    }

    /**
     * 销毁的回调
     */
    onDismiss() {

    }

    /**
     * 
     * 显示设置菜单
     * 
     * @param {*} host 
     * @param {*} data 
     * @returns 
     */
    static Show(host, data) {
        const panel = new SetterPanel();
        document.body.appendChild(panel);
        panel.setContent(new Setter(host));
        panel.placement(host);
        return panel;
    }
}

CustomElementRegister(tagName, Setter);
