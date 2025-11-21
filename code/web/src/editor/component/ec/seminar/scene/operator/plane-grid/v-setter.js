/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-scene-plane-grid-setter';

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
    #w;
    #h;
    #v_segments;
    #h_segments;
    
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
        this.#w = this.getChild('#w');
        this.#h = this.getChild('#h');
        this.#v_segments = this.getChild('#v-segments');
        this.#h_segments = this.getChild('#h-segments');
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    setW(value) {
        this.#w.setValue(parseFloat(value));
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
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    set_V_Segments(value) {
        this.#v_segments.setValue(parseInt(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} value 
     */
    set_H_Segments(value) {
        this.#h_segments.setValue(parseInt(value));
    }

    /**
     * 获取
     */
    get w() {
        return this.#w.getValue();
    }

    /**
     * 获取
     */
    get h() {
        return this.#h.getValue();
    }

    /**
     * 获取
     */
    get v_segments() {
        return this.#v_segments.getValue();
    }

    /**
     * 获取
     */
    get h_segments() {
        return this.#h_segments.getValue();
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
                w: this.w,
                h: this.h,
                v_segments : this.v_segments,
                h_segments : this.h_segments,
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
