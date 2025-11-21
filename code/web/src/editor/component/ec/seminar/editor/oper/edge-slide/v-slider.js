/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import isNumber                 from 'lodash/isNumber';
import isString                 from 'lodash/isString';
import Animation                from '@common/misc/animation';
import ComputePosition          from '@common/misc/compute-position';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Html                     from './v-slider-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-editor-edge-slide-slider';

/**
 * 用来滑动
 */
export default class Slider extends Element {
    /**
     * 元素
     */
    #container;
    #slider_container;
    #bar;
    #btn_cancel;
    #btn_commit;

    /**
     * 百分比
     */
    #percent = 0;

    /**
     * 记录
     */
    #pointer_down_screen_x = undefined;
    #pointer_down_percent = 0;

    /**
     * 百分比变化
     */
    on_percent_changed;
    on_cancel;
    on_commit;

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
        this.#container        = this.getChild('#container');
        this.#slider_container = this.getChild('#slider-container');
        this.#bar              = this.getChild('#bar');
        this.#btn_cancel       = this.getChild('#cancel');
        this.#btn_commit       = this.getChild('#commit');

        // 监听事件
        this.#slider_container.onpointerdown = event => {
            this.#slider_container.setPointerCapture(event.pointerId);
            this.#pointer_down_screen_x = event.screenX;
            this.#pointer_down_percent = this.#percent;
        };

        this.#slider_container.onpointermove = event => {
            let current_screen_x = event.screenX;
            if (undefined == this.#pointer_down_screen_x) {
                return;
            }

            let offset = (current_screen_x - this.#pointer_down_screen_x) 
                         / this.#slider_container.offsetWidth * 2.0;
            let current_percent = this.#pointer_down_percent + offset;
            this.setPercent(current_percent);
        };

        this.#slider_container.onpointerup = event => {
            this.#pointer_down_screen_x = undefined;
            this.#slider_container.releasePointerCapture(event.pointerId);
        };

        this.#btn_cancel.onclick = event => {
            if (isFunction(this.on_cancel)) {
                this.on_cancel();
            }
        };

        this.#btn_commit.onclick = event => {
            if (isFunction(this.on_commit)) {
                this.on_commit();
            }
        };
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent = undefined) {
        if (undefined == parent) {
            parent = document.body;
        }
        document.body.appendChild(this);
    }

    /**
     * 
     * 移动到指定元素的附近
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    moveTo(reference_element, placement, offset = 10) {
        if (isString(placement) && isNumber(offset)) {
            ComputePosition(reference_element, this, placement, offset);
        }
    }

    /**
     * 
     * 设置当前的进度 -1 到 +1
     * 
     * @param {number} percent 
     */
    setPercent(percent) {
        if (!isNumber(percent)) {
            percent = 0;
        } else {
            percent = Math.clamp(percent, -1.0, 1.0);
        }

        if (this.#percent == percent) {
            return;
        }

        this.#percent = percent;
        this.#bar.style.left = `${(this.#percent + 1) * 0.5 * 100}%`;

        // 回调
        if (isFunction(this.on_percent_changed)) {
            this.on_percent_changed(this.#percent);
        }
    }

    /**
     * 移除，以动画的方式
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Slider);
