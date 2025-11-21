/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Export                from '../model-export';
import SceneSelectedTree     from '../scene-selected-tree';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-export-model';

/**
 * 序列化
 */
export default class Model extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
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
        this.#selector         = this.getChild('#selector');
        this.#download         = this.getChild('#download');
        this.#selected_only    = this.getChild('#selected-only');
        this.#download.onclick = () => this.#onClickDownload();
    }

    /**
     * 点击下载
     */
    #onClickDownload() {
        const scene = this.#coordinator.scene;
        const type  = this.#selector.data;
        if (this.#selected_only.checked) {
            const scene = new SceneSelectedTree(this.#coordinator);
            Export(type, scene, undefined, undefined);
        } else {
            Export(type, scene, undefined, undefined);
        }
    }
}

CustomElementRegister(tagName, Model);
