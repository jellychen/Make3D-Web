/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import NavToolbarAdvance     from './v-advance';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-modifier';

/**
 * 菜单项
 */
export default class BizNavToolbarModifier extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 高级 toolbar
     */
    #toolbar_advance;

    /**
     * 元素
     */
    #container;
    #switcher_container;
    #pointer;
    #advance;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.setCoordinator(coordinator);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container          = this.getChild('#container');
        this.#switcher_container = this.getChild('#switcher-container');
        this.#pointer            = this.getChild('#pointer');
        this.#advance            = this.getChild('#advance');
        this.#switcher_container.addEventListener('changed', (event) => {
            this.#onSwitcherChanged(event);
        });
        this.#advance.onclick = event => this.#showAdvance(event);
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
        if (this.#toolbar_advance) {
            this.#toolbar_advance.resetSwitcherSelectedStatus();
        } else {
            this.#switcher_container.select(this.#pointer);
        }
    }

    /**
     * 
     * switcher 变化
     * 
     * @param {*} event 
     */
    #onSwitcherChanged(event) {
        const token = event.token;
        if (!isString(token) || token.length == 0) {
            return;
        }

        // 发送信号
        this.#coordinator.sendCommandToEc({
            type: token
        });
    }

    /**
     * 显示高级功能
     */
    #showAdvance() {
        this.#toolbar_advance = new NavToolbarAdvance(this.#coordinator);
        this.#toolbar_advance.onclose = () => {
            this.#toolbar_advance = undefined;
        };
        this.#container.appendChild(this.#toolbar_advance);
    }
}

CustomElementRegister(tagName, BizNavToolbarModifier);
