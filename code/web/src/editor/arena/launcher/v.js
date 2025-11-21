/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ImageSrc              from '@assets/images/picture/repair-cover.webp';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-launcher';

/**
 * 加载器
 */
export default class Launcher extends Element {
    /**
     * 元素
     */
    #cover_image;
    #close;
    #load_from_local;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.setEnableCustomizeMenu(true);
        this.#cover_image = this.getChild('#img');
        this.#cover_image.setSrc(ImageSrc);
        this.#close = this.getChild('#close');
        this.#close.onclick = event => this.#onClickClose(event);
        this.#load_from_local = this.getChild('#load-0');
        this.#load_from_local.onclick = event => this.#onClickLoadFromLocal(event);
    }

    /**
     * 显示从本地加载
     */
    showLoadFromLocal() {
        const a = this.getChild('#load-from-local');
        const b = this.getChild('#load-from-cloud');
        if (a) a.style.display = 'flex';
        if (b) b.style.display = 'none';
    }

    /**
     * 显示从云端加载
     */
    showLoadFromCloud() {
        const a = this.getChild('#load-from-local');
        const b = this.getChild('#load-from-cloud');
        if (a) a.style.display = 'none';
        if (b) b.style.display = 'flex';
    }

    /**
     * 
     * 点击了关闭按钮
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        this.dispose();
    }

    /**
     * 
     * 点击在本地加载
     * 
     * @param {*} event 
     */
    #onClickLoadFromLocal(event) {
        
    }

    /**
     * 销毁
     */
    dispose() {
        this.remove();
    }
}

CustomElementRegister(tagName, Launcher);