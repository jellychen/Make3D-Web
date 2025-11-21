/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-substantialization-setter';

/**
 * 设置器
 */
export default class Setter extends BaseSetter {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #f;
    #b;

    /**
     * 数据变动回调
     */
    #data_changed_callback;
    #commit_callback;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {Function} data_changed_callback 
     * @param {Function} commit_callback 
     */
    constructor(host, data_changed_callback, commit_callback) {
        super(tagName);
        this.#host = host;
        if (isFunction(data_changed_callback)) {
            this.#data_changed_callback = data_changed_callback;
        }

        if (isFunction(commit_callback)) {
            this.#commit_callback = commit_callback;
        }
        this.observerBubblesEvent();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#f = this.getChild('#front');
        this.#b = this.getChild('#back');
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setFront(value) {
        this.#f.setValue(parseFloat(value));

    }

    /**
     * 获取
     */
    get front() {
        return this.#f.getValue();
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setBack(value) {
        this.#b.setValue(parseFloat(value));
    }

    /**
     * 获取
     */
    get back() {
        return this.#b.getValue();
    }

    /**
     * 
     * 接收孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        event.stopPropagation();
        super.onRecvBubblesEvent(event);

        // 分发
        if (event.detail.token === 'commit') {
            if (isFunction(this.#commit_callback)) {
                this.#commit_callback();
            }
        } else if (isFunction(this.#data_changed_callback)) {
            this.#data_changed_callback({
                front   : this.front,
                back    : this.back,
            });
        }
    }

    /**
     * 销毁
     */
    dispose() {

    }
}

CustomElementRegister(tagName, Setter);
