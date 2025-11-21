/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import VipSupervisor         from '@editor/arena/vip-supervisor';
import Export                from '../model-export';
import ProcessBar            from './v-process-bar';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-export-printer-3d';

/**
 * 序列化
 */
export default class Printer3D extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #selector;
    #download;
    #selected_only;

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
        this.#container        = this.getChild('#container');
        this.#selector         = this.getChild('#selector');
        this.#download         = this.getChild('#download');
        this.#selected_only    = this.getChild('#selected-only');
        this.#download.onclick = () => this.#onClickDownload();
    }

    /**
     * 点击下载
     */
    #onClickDownload() {
        // if (!VipSupervisor(this.#download)) {
        //     return;
        // }
        const process_bar = new ProcessBar(this.#coordinator);
        this.#container.appendChild(process_bar);
        const type = this.#selector.data;
        const selected_only = this.#selected_only.checked;
        process_bar.start(type, selected_only);
    }
}

CustomElementRegister(tagName, Printer3D);
