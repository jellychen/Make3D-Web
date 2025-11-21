/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Classes               from './v-classes';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-subdivision-setter';

/**
 * 设置
 */
export default class Setter extends BaseSetter {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #classes;   // 细分类型
    #count;     // 细分的次数

    /**
     * 数据变动回调
     */
    #data_changed_callback;
    #commit_callback;

    /**
     * 获取值
     */
    get count() {
        return this.#count.getValue();
    }

    /**
     * 获取
     * 
     * cc
     * simple
     * 
     */
    get classes() {
        return this.#classes.data;
    }

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
        this.#classes = this.getChild('#classes');
        this.#count   = this.getChild('#count');
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} value 
     */
    setCount(value) {
        this.#count.setValue(parseInt(value));
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
                classes : this.classes,
                count : this.count,
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
