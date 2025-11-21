/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-misc';

/**
 * 杂项
 */
export default class Misc extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #switcher;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        super.createContentFromTpl(tpl)
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher = this.getChild('#switcher');
        this.#switcher.addEventListener('changed', event => {
            if (this.#coordinator) {
                this.#coordinator.setEnableDevToolsPerformance(event.checked);
            }
        });
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
     * 执行加载
     */
    load() {

    }

    /**
     * 更新
     */
    update() {
        
    }
}

CustomElementRegister(tagName, Misc);
