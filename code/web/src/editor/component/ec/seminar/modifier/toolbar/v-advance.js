/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-advance-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-modifier-advance';

/**
 * 高级菜单项
 */
export default class BizNavToolbarModifierAdvance extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 销毁事件
     */
    onclose;

    /**
     * 元素
     */
    #container;
    #switcher_container;
    #close;

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
        this.#close              = this.getChild('#close');
        this.#close.onclick      = event => this.dismiss(event);
        this.#switcher_container.addEventListener('changed', (event) => {
            this.#onSwitcherChanged(event);
        });
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Try(this.#container, {
            translateX: [60, 0],
            opacity   : [0, 1],
            duration  : 300,
            easing    : 'easeOutCubic',
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
     * 重置选择的状态
     */
    resetSwitcherSelectedStatus() {
        this.#switcher_container.unselected();
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
     * 退出
     */
    dismiss() {
        Animation.Try(this.#container, {
            translateX: [0, 60],
            opacity   : [1, 0],
            duration  : 200,
            easing    : 'easeOutCubic',
            onComplete: () => {
                if (isFunction(this.onclose)) {
                    try {
                        this.onclose();
                    } catch(e) {
                        console.error(e);
                    }
                }
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, BizNavToolbarModifierAdvance);
