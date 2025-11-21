/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './v-tween-selector';
import Html                  from './v-tween-selector-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-tween-selector-panel';

/**
 * 动画选择器窗口
 */
export default class TweenSelectorPanel extends Element {
    /**
     * 元素
     */
    #selector;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

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
        this.#selector = this.getChild('#selector');
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        Animation.Remove(this);
    }

    /**
     * 
     * 展示一个
     * 
     * @param {*} ref_element 
     * @param {*} callback 
     */
    static Show(ref_element, callback) {
        const panel = new TweenSelectorPanel();
        panel.#selector.onselected = type => {
            if (isFunction(callback)) {
                try {
                    callback(type);
                } catch (e) {
                    console.error(e);
                }
            }
            Animation.Remove(panel);
        };
        document.body.appendChild(panel);
        ComputePosition(ref_element, panel, 'top-center', 10);
        return panel;
    }
}

CustomElementRegister(tagName, TweenSelectorPanel);
