/* eslint-disable no-unused-vars */

import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import ShowAnimationDashboard   from '@editor/component/animation-dashboard';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-keyframe';

/**
 * 旋转
 */
export default class Keyframe extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #open;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#open = this.getChild('#btn-container');
        this.#open.onclick = () => {
            ShowAnimationDashboard(this.#coordinator);
        };
    }
}

CustomElementRegister(tagName, Keyframe);
