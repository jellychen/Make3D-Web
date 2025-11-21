/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-figma-reminder';

/**
 * 作为Figma插件使用的提醒
 */
export default class FigmaReminder extends Element {
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
        this.getChild('#button').onclick = () => this.dismiss();
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, FigmaReminder);
