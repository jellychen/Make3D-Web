/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-setter-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-receptacle-setter';

/**
 * item 点击后弹出的设置的容器
 */
export default class ReceptacleSetter extends Element {
    /**
     * 点击确认
     */
    onClickOk;

    /**
     * 元素
     */
    #content;
    #btn_ok;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

    /**
     * 内容，只能设置一次
     */
    #content_child;
    
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
        this.#content = this.getChild('#content');
        this.#btn_ok  = this.getChild('#button');
        this.#btn_ok.onclick = event => this.#onClickOk(event);
        this.onpointerdown   = event => event.stopPropagation();
        this.onclick         = event => event.stopPropagation();
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {*} content 
     * @returns 
     */
    setContent(content) {
        if (this.#content_child) {
            throw new Error('content has already set');
        }
        this.#content_child = content;
        this.#content.appendChild(content);
        return this;
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
     * 自动可见
     * 
     * @param {*} host 
     * @returns 
     */
    placement(host) {
        const body_h = document.body.clientHeight;
        const r0     = host.getBoundingClientRect();
        const r1     = this.getBoundingClientRect();

        // 计算位置
        let x        = r0.right - r1.width;
        let y        = 0;

        // 如果下面放不下就放上面
        if (r0.bottom + r1.height > body_h) {
            y = r0.top - r1.height - 5;
        } else {
            y = r0.bottom + 5;
        }

        // 设置位置
        this.setLocation(x, y);

        // 渐渐显示
        this.style.opacity = 0;
        Animation.FadeIn(this);

        return this;
    }

    /**
     * 
     * 设置当前的显示
     * 
     * @param {*} x 
     * @param {*} y 
     */
    setLocation(x, y) {
        this.style.left = `${x}px`;
        this.style.top  = `${y}px`;
    }

    /**
     * 
     * 销毁
     * 
     * @returns 
     */
    dismiss() {
        const content = this.#content_child;
        if (content && isFunction(content.onDismiss)) {
            try {
                content.onDismiss();
            } catch (e) {
                console.error(e);
            }
        }
        Animation.Remove(this);
        return this;
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        this.dismiss();
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickOk(event) {
        if (isFunction(this.onClickOk)) {
            try {
                this.onClickOk();
            } catch (e) {
                console.error(e);
            }
        }
        this.dismiss();
    }
}

CustomElementRegister(tagName, ReceptacleSetter);