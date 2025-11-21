/* eslint-disable no-unused-vars */

import isString               from 'lodash/isString';
import isFunction             from 'lodash/isFunction';
import isNumber               from 'lodash/isNumber';
import isUndefined            from 'lodash/isUndefined';
import FaceImage              from '@assets/images/picture/svg-from-figma.webp';
import Animation              from '@common/misc/animation';
import ComputePosition        from '@common/misc/compute-position';
import CustomElementRegister  from '@ux/base/custom-element-register';
import Element                from '@ux/base/element';
import ElementDomCreator      from '@ux/base/element-dom-creator'
import Figma                  from '@/embed/figma';
import Html                   from './v-creator-figma-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-scene-svg-creator-figma';

/**
 * 创建
 */
export default class Creator extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #btn_extractor;

    /**
     * 创建
     */
    on_create;

    /**
     * 销毁
     */
    on_dimiss;

    /**
     * 事件回调
     */
    #on_dismiss      = (event) => this.#onDismiss (event);
    #on_click_create = (event) => this.#onClickCreate(event);

    /**
     * 构造函数
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
        this.#btn_extractor = this.getChild("#button");
        this.#btn_extractor.addEventListener('click', this.#on_click_create);
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
     * 动态摆放
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    show(reference_element, placement = "auto", offset = 0) {
        this.remove();
        document.body.appendChild(this);
        if (isString(placement) && isNumber(offset)) {
            if (reference_element) {
                ComputePosition(reference_element, this, placement, offset);
            }
        }
    }

    /**
     * 销毁
     */
    dismiss() {
        if (isFunction(this.on_dimiss)) {
            this.on_dimiss();
        }
        Animation.Remove(this);
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
        this.style.pointerEvents = 'none';
        this.dismiss();
    }

    /**
     * 
     * 统一构建
     * 
     * @param {*} event 
     */
    async #onClickCreate(event) {
        const result = await Figma.invoke('selection-svg');
        if (result.success && !isUndefined(result.data)) {
            if (isFunction(this.on_create)) {
                this.on_create(result.data);
            }
        }
    }
}

CustomElementRegister(tagName, Creator);