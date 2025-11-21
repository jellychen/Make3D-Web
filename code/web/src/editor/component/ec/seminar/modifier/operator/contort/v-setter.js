/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-contort-setter';

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
    #coordinate_dir;
    #angle;

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
        this.#coordinate_dir = this.getChild('#coordinate-dir');
        this.#angle = this.getChild('#angle');
    }

    /**
     * 
     * 设置百分百， -360 - +360
     * 
     * @param {Number} value 
     */
    setAngle(value) {
        value = parseInt(value);
        if (value < -360) value = -360;
        if (value > +360) value = +360;
        this.#angle.setValue(value);
    }

    /**
     * 获取百分比
     */
    get angle() {
        return this.#angle.getValue();
    }

    /**
     * 
     * 设置方向
     * 
     * @param {string} dir 
     */
    setCoordinateDir(dir) {
        if (isString(dir)) {
            this.#coordinate_dir.setSelected(dir);
        }
    }

    /**
     * 获取方向
     */
    get coordinateDir() {
        return this.#coordinate_dir.selected;
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
                angle : this.angle,
                dir   : this.coordinateDir,
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
