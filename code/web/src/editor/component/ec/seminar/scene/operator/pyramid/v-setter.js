/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-scene-pyramid-setter';

/**
 * 设置器
 */
export default class Setter extends BaseSetter {
    /**
     * 宿主
     */
    #host = undefined;

    /**
     * 元素
     */
    #x;
    #y;
    #h;

    /**
     * 数据变动回调
     */
    #data_changed_callback;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {Function} data_changed_callback 
     */
    constructor(host, data_changed_callback) {
        super(tagName);
        this.#host = host;
        if (isFunction(data_changed_callback)) {
            this.#data_changed_callback = data_changed_callback;
        }
        this.observerBubblesEvent();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#x = this.getChild('#x');
        this.#y = this.getChild('#y');
        this.#h = this.getChild('#h');
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setX(value) {
        this.#x.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setY(value) {
        this.#y.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setH(value) {
        this.#h.setValue(parseFloat(value));
    }

    /**
     * 获取
     */
    get x() {
        return this.#x.getValue();
    }

    /**
     * 获取
     */
    get y() {
        return this.#y.getValue();
    }

    /**
     * 获取
     */
    get h() {
        return this.#h.getValue();
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

        // 提交
        if (event.detail.token === 'commit') {
            this.#host.dismiss();
        }

        // 回调函数
        else if (isFunction(this.#data_changed_callback)) {
            this.#data_changed_callback({
                x: this.x,
                y: this.y,
                h: this.z,
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
