/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-uv';

/**
 * UV
 */
export default class UV extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 当前关注 element
     */
    #attached_element;
    #has_uv;
    #has_no_uv;
    #btn_remove;
    #btn_compute;

    /**
     * 遮罩 
     */
    #mask;

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
        this.#mask        = this.getChild('#mask');
        this.#has_uv      = this.getChild('#has-uv');
        this.#has_no_uv   = this.getChild('#has-no-uv');
        this.#btn_remove  = this.getChild('#del');
        this.#btn_compute = this.getChild('#compute');
        this.#btn_remove .onclick = event => this.#onClickRemove(event);
        this.#btn_compute.onclick = event => this.#onClickSimpleCompute(event);
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 回滚到默认值
     */
    resetToDefault() {
        this.#attached_element = undefined;
    }

    /**
     * 
     * attach 指定的元素
     * 
     * @param {*} element 
     */
    attach(element) {
        this.detach();
        this.#attached_element = element;
        this.update();
    }

    /**
     * detach
     */
    detach() {
    }

    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    showMask(show) {
        if (show) {
            this.#mask.style.display = 'block';
        } else {
            this.#mask.style.display = 'none';
        }
    }

    /**
     * 更新
     */
    update() {
        if (this.#attached_element && this.#attached_element.isMesh) {
            this.showMask(false);
            if (this.#attached_element.hasUV()) {
                this.#has_no_uv.style.display = 'none';
                this.#has_uv.style.display    = 'flex';
            } else {
                this.#has_no_uv.style.display = 'flex';
                this.#has_uv.style.display    = 'none';
            }
        } else {
            this.showMask(true);
        }
    }

    /**
     * 
     * 点击移除
     * 
     * @param {*} event 
     */
    #onClickRemove(event) {
        if (this.#attached_element) {
            if (isFunction(this.#attached_element.removeUV)) {
                if (this.#attached_element.removeUV()) {
                    this.#coordinator.renderNextFrame();
                }
            }
        }
        this.update();
    }

    /**
     * 
     * 添加计算
     * 
     * @param {*} event 
     */
    #onClickSimpleCompute(event) {
        try {
            if (this.#attached_element) {
                if (isFunction(this.#attached_element.trialCompensationUV)) {
                    if (this.#attached_element.trialCompensationUV()) {
                        this.#coordinator.renderNextFrame();
                    }
                }
            }
        } catch(e) {
            console.error('trialCompensationUV error');
        }
        this.update();
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
    }
}

CustomElementRegister(tagName, UV);
