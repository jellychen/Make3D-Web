/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import BaseSetter            from '../base-setter';
import FacesCount            from './v-faces-count';
import Tips                  from './v-tips';
import Html                  from './v-setter-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-quadremesh-setter';

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
    #faces_count;
    #sharp;
    #boundary;
    #adaptive_scale;
    #commit;

    /**
     * 数据变动回调
     */
    #commit_callback;

    /**
     * 获取
     */
    get faces_count() {
        return this.#faces_count.faces_count;
    }

    /**
     * 获取
     */
    get sharp() {
        return this.#sharp.isChecked();
    }

    /**
     * 获取
     */
    get boundary() {
        return this.#boundary.isChecked();
    }

    /**
     * 获取
     */
    get adaptive_scale() {
        return this.#adaptive_scale.isChecked();
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {Function} commit_callback 
     */
    constructor(host, commit_callback) {
        super(tagName);
        this.#host = host;
        if (isFunction(commit_callback)) {
            this.#commit_callback = commit_callback;
        }
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#faces_count    = this.getChild('#faces_count');
        this.#sharp          = this.getChild('#sharp');
        this.#boundary       = this.getChild('#boundary');
        this.#adaptive_scale = this.getChild('#adaptive-scale');
        this.#commit         = this.getChild('#commit');
        this.#commit.onclick = event => {
            if (isFunction(this.#commit_callback)) {
                try {
                    this.#commit_callback();
                } catch (e) {
                    console.error(e);
                }
            }
        };
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}

CustomElementRegister(tagName, Setter);
