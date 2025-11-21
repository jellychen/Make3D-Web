/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shortcut';

/**
 * 展示快捷键的面板
 */
export default class ShortCut extends Element {
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
    }

    /**
     * 
     * 显示
     * 
     * @param {boolean} animation 
     */
    show(animation) {
        document.body.appendChild(this);
        if (animation) {
            this.style.opacity = 0;
            Animation.FadeIn(this);
        }
    }

    /**
     * 从界面中移除
     */
    dismiss() {
        this.remove();
    }
}

CustomElementRegister(tagName, ShortCut);
