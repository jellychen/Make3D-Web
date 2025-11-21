/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-scene-helix-setter';

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
    #r0;
    #r1;
    #malposition;
    #n_subdivisions;
    #n_steps;
    #angle_start;
    #angle_end;

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
        this.#r0             = this.getChild('#r0');
        this.#r1             = this.getChild('#r1');
        this.#malposition    = this.getChild('#malposition');
        this.#n_subdivisions = this.getChild('#subdivisions');
        this.#n_steps        = this.getChild('#steps');
        this.#angle_start    = this.getChild('#angle-start');
        this.#angle_end      = this.getChild('#angle-end');
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setR0(value) {
        this.#r0.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setR1(value) {
        this.#r1.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setMalposition(value) {
        this.#malposition.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setSubdivisions(value) {
        this.#n_subdivisions.setValue(parseInt(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setSteps(value) {
        this.#n_steps.setValue(parseInt(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setAngleStart(value) {
        this.#angle_start.setValue(parseFloat(value));
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setAngleEnd(value) {
        this.#angle_end.setValue(parseFloat(value));
    }

    /**
     * 获取
     */
    get r0() {
        return this.#r0.getValue();
    }

    /**
     * 获取
     */
    get r1() {
        return this.#r1.getValue();
    }

    /**
     * 获取
     */
    get malposition() {
        return this.#malposition.getValue();
    }

    /**
     * 获取
     */
    get subdivisions() {
        return this.#n_subdivisions.getValue();
    }

    /**
     * 获取
     */
    get steps() {
        return this.#n_steps.getValue();
    }

    /**
     * 获取
     */
    get angleStart() {
        return this.#angle_start.getValue();
    }

    /**
     * 获取
     */
    get angleEnd() {
        return this.#angle_end.getValue();
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
                r0          : this.r0,
                r1          : this.r1,
                malposition : this.malposition,
                subdivisions: this.subdivisions,
                steps       : this.steps,
                angle_start : this.angleStart,
                angle_end   : this.angleEnd,
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
