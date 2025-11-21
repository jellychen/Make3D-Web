/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Element               from '@ux/base/element';
import Performer             from './performer';
import Html                  from './v-prompt-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-merge-prompt';

/**
 * 提问框
 */
export default class Prompt extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #btn_comfirm;
    #btn_cancel;
    #recursion;
    
    /**
     * 执行器
     */
    #performer;

    /**
     * 回调事件
     */
    on_confirm;
    on_cancel;

    /**
     * 获取
     */
    get soup() {
        if (this.#performer) {
            return this.#performer.merged_soup;
        }
        return null;
    }

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
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#performer = new Performer(this.#coordinator, false);
        this.#container           = this.getChild('#container');
        this.#btn_cancel          = this.getChild('#cancel');
        this.#btn_comfirm         = this.getChild('#commit');
        this.#recursion           = this.getChild('#switcher');
        this.#btn_cancel.onclick  = () => this.#onClickBtnCancel();
        this.#btn_comfirm.onclick = () => this.#onClickBtnConfirm();
        this.#recursion.onchanged = () => this.#onRecursionChanged();
        this.#updateEditableMeshedCount();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this.#container);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parentNode 
     */
    show(parentNode) {
        if (!parentNode) {
            parentNode = document.body;
        }
        parentNode.appendChild(this);
    }

    /**
     * 递归选项发生变化
     */
    #onRecursionChanged() {
        const recursion = this.#recursion.checked;
        this.#performer = new Performer(this.#coordinator, recursion);
        this.#updateEditableMeshedCount();
    }

    /**
     * 点击取消
     */
    #onClickBtnCancel() {
        if (isFunction(this.on_cancel)) {
            this.on_cancel();
        }
        this.dismiss();
    }

    /**
     * 点击确认
     */
    #onClickBtnConfirm() {
        if (this.#performer.empty) {
            return;
        }

        if (this.#performer.empty) {
            this.dismiss();
            return;
        }

        this.#performer.start(mesh => {
                ;
            },

            () => {
                if (isFunction(this.on_confirm)) {
                    this.on_confirm();
                }
                this.dismiss();
            }
        );
    }

    #updateEditableMeshedCount() {
        const count = this.#performer.editable_meshed_count;
    }

    /**
     * 销毁
     */
    dismiss() {
        if (this.#performer) {
            this.#performer.dispose();
            this.#performer = undefined;
        }
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Prompt);
