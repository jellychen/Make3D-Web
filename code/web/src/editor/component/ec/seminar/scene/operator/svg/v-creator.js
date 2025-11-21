/* eslint-disable no-unused-vars */

import isFunction             from 'lodash/isFunction';
import isNumber               from 'lodash/isNumber';
import isString               from 'lodash/isString';
import isUndefined            from 'lodash/isUndefined';
import FaceImage              from '@assets/images/picture/svg-from-figma.webp';
import Animation              from '@common/misc/animation';
import ComputePosition        from '@common/misc/compute-position';
import CustomElementRegister  from '@ux/base/custom-element-register';
import Element                from '@ux/base/element';
import ElementDomCreator      from '@ux/base/element-dom-creator'
import Html                   from './v-creator-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-scene-svg-creator';

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
    #image;
    #text_input;
    #btn_create;

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
    #on_drop_file    = event => this.#onDropFile(event);
    #on_dismiss      = event => this.#onDismiss(event);
    #on_click_create = event => this.#onClickCreate(event);
    
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
        this.#image      = this.getChild("#svg-from-figma");
        this.#text_input = this.getChild("#text-input");
        this.#btn_create = this.getChild("#create");
        this.#image.setSrc(FaceImage);
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
        Animation.Try(this, {
            translateY: [-60, 0],
            opacity   : [0, 1],
            duration  : 300,
            easing    : 'easeOutCubic',
        });
        this.#text_input.setFocus();
        this.#text_input.addEventListener('drop', this.#on_drop_file, false);
        this.#btn_create.addEventListener('click', this.#on_click_create);
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
     * 接收到文件
     * 
     * @param {*} event 
     */
    #onDropFile(event) {
        event.preventDefault();
        event.stopPropagation();

        // 获取数据
        const files = event.dataTransfer.files;
        if (!files.length) {
            this.#text_input.value = '';
            return;
        }

        const file = files[0];
        if (isUndefined(file)) {
            this.#text_input.value = '';
            return;
        }

        // 检测类似
        if (file.type !== 'image/svg+xml') {
            this.#text_input.value = '';
            return;
        }

        //
        // 检测大小
        // 如果超过 64KB 就不解析
        //
        if (file.size > 64 * 1024) {
            this.#text_input.value = '';
            return;
        }

        // 读取数据
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = event => {
            this.#text_input.value = event.target.result;
        };
    }

    /**
     * 
     * 统一构建
     * 
     * @param {*} event 
     */
    #onClickCreate(event) {
        if (isFunction(this.on_create) && this.#text_input.value.length > 0) {
            try {
                this.on_create(this.#text_input.value);
            } catch (e) {
                console.error(e);
            }
        }
        this.dismiss();
    }
}

CustomElementRegister(tagName, Creator);
