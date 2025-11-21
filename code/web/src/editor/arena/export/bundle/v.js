/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Serializer            from '@core/serializer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-export-bundle';

/**
 * 序列化
 */
export default class Bundle extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #download;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#download = this.getChild('#download');
        this.#download.onclick = async () => await this.#onClickDownload();
    }

    /**
     * 点击下载
     */
    async #onClickDownload() {
        const scene = this.#coordinator.scene;
        const serializer = new Serializer.Serializer(scene);
        await serializer.prepareTexture();
        serializer.storeAsync();
        serializer.generateZipBlobAsyncAndDownloader("Scene.m3d");
    }
}

CustomElementRegister(tagName, Bundle);
