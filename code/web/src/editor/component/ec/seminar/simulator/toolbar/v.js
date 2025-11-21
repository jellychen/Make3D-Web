/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-simulator';

/**
 * 菜单项
 */
export default class BizNavToolbarSimulator extends Element {
    /**
     * 核心协调器
     */
    #coordinator = undefined;

    /**
     * 元素
     */
    #switcher_container;
    #pointer;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator = undefined) {
        super(tagName);
        this.setCoordinator(coordinator);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher_container = this.getChild('#switcher-container');
        this.#pointer            = this.getChild('#pointer');
        this.#switcher_container.addEventListener('changed', (event) => {
            this.#onSwitcherChanged(event);
        });
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 重置状态
     */
    reset() {
        this.resetSwitcherSelectedStatus();
    }

    /**
     * 重置状态
     */
    resetSwitcherSelectedStatus() {
        this.#switcher_container.select(this.#pointer);
    }

    /**
     * 
     * switcher 变化
     * 
     * @param {*} event 
     */
    #onSwitcherChanged(event) {
        let token = event.token;
        if (!isString(token) || token.length == 0) {
            return;
        }

        // 发送信号
        this.#coordinator.sendCommandToEc({
            type: token
        });
    }
}

CustomElementRegister(tagName, BizNavToolbarSimulator);
