/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer-block-clearcoat';

/**
 * 基础层
 */
export default class Block extends Element {
    /**
     * 获取
     */
    get type() {
        return 'clearcoat';
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
    }

    /**
     * 
     * 收集配置
     * 
     * @param {*} conf 
     * @returns 
     */
    collectConfiguration(conf) {
        if (!conf || !isFunction(conf.setAo)) {
            return this;
        }
        return this;
    }
}

CustomElementRegister(tagName, Block);
