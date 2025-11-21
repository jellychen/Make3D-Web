/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-denoising-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-denoising';

/**
 * 用来显示当前正在降噪
 */
export default class Denoising extends Element {
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
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent) {
        parent.appendChild(this);
        this.style.opacity = 0;
        Animation.Try(
            this,
            {
                opacity: 1,
                duration: 300,
                easing: 'easeOutCubic',
            }
        );
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Try(
            this,
            {
                opacity: 0,
                duration: 300,
                easing: 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                }
            }
        );
    }
}

CustomElementRegister(tagName, Denoising);
