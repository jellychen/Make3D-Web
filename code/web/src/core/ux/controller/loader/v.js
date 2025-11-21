/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */

// import AssetsManager         from '@assets/assets-manager';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-loader';

/**
 * 加载
 */
export default class Loader extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
    }
}

CustomElementRegister(tagName, Loader);
