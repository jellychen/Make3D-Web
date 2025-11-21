/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
import Renderer              from './renderer';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-xthree-webgpu-dashboard';

/**
 * WebGPU 面板
 */
export default class WebgpuDashboard extends Element {
    /**
     * 渲染
     */
    #renderer;

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
        const canvas = this.getChild("canvas");
        this.#renderer = new Renderer(canvas);
        this.#renderer.init();
    }
}

CustomElementRegister(tagName, WebgpuDashboard);
