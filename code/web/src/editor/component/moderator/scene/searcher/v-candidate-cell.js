/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IconSetter            from '../icon';
import Html                  from './v-candidate-cell.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-r-scene-searcher-candidate-cell';

/**
 * 搜索候选词
 */
export default class SceneSearcherCandidateSelectorCell extends Element {
    /**
     * 宿主选择器
     */
    #host_selector = undefined;

    /**
     * 元素
     */
    #container;
    #icon;
    #text;

    /**
     * 外部数据
     */
    #user_data = undefined;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host_selector 
     */
    constructor(host_selector) {
        super(tagName);
        this.#host_selector = host_selector;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#icon = this.getChild('#icon');
        this.#text = this.getChild('#text');
        this.#container.onpointerup = (event) => this.#onPointerUp(event);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 设置
     * 
     * @param {*} type 
     */
    setIconType(type) {
        IconSetter(this.#icon, type);
    }

    /**
     * 
     * 设置选择
     * 
     * @param {boolean} selected 
     */
    setSelected(selected) {
        if (selected) {
            this.#container.setAttribute('selected', 'true');
        } else {
            this.#container.setAttribute('selected', 'false');
        }
    }

    /**
     * 
     * 设置显示的文本
     * 
     * @param {string} data 
     */
    setText(data) {
        this.#text.setRaw(data);
    }

    /**
     * 
     * 设置附带的数据
     * 
     * @param {*} data 
     */
    setUserData(data) {
        this.#user_data = data;
    }

    /**
     * 
     * 获取数据
     * 
     * @returns 
     */
    getUserData() {
        return this.#user_data;
    }

    /**
     * 
     * 设置数据
     * 
     * @param {*} data 
     */
    setData(data) {
        data = data || {};
        data = data.item || {};

        // ========================================================================================
        // 类型
        // ========================================================================================
        if (undefined != data.type) {
            this.setIconType(data.type);
        }

        // ========================================================================================
        // 名称
        // ========================================================================================
        if (undefined != data.name) {
            this.setText(data.name);
        }

        // ========================================================================================
        // 用户数据
        // ========================================================================================
        this.setUserData(data.user_data);
    }

    /**
     * 
     * 点击事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        event.stopPropagation();

        if (!this.#host_selector) {
            return;
        }

        if (isFunction(this.#host_selector.onCellSelected)) {
            this.#host_selector.onCellSelected(this.#user_data);
        }
    }
}

CustomElementRegister(tagName, SceneSearcherCandidateSelectorCell);
