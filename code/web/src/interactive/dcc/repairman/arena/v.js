/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Content               from '@ux/base/content';
import Loader                from './model-loader';
import Header                from './header/v';
import Title                 from './title/v';
import Preview               from './preview/v';
import Features              from './features/v';
import Footer                from './footer/v';
import RepairProcess         from './v-repair-process';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-arena';

/**
 * 根元素
 */
export default class Arena extends Content {
    /**
     * 元素
     */
    #controller;
    #upload;
    #input;
    #preview;
    #process;

    /**
     * 渲染的场景
     */
    #scene;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#controller      = this.getChild('#controller');
        this.#upload          = this.getChild('#upload');
        this.#input           = this.getChild('#input');
        this.#preview         = this.getChild('#preview');
        this.#process         = this.getChild('#process');
        this.#upload.onclick  = () => this.#onClickUpload();
        this.#process.onclick = () => this.#onClickProcess();
        this.#input.onchange  = event => this.#onInputChanged(event);
    }

    /**
     * 点击上载
     */
    #onClickUpload() {
        this.#input.click();
    }

    /**
     * 
     * 上载了文件
     * 
     * @param {*} event 
     */
    #onInputChanged(event) {
        const loader = new Loader();
        const files = event.target.files;
        for (const file of files) {
            loader.addFile(file, () => {
                this.#preview.renderer.renderNextFrame();
            });
        }
        this.#input.value = null;
        this.#preview.setScene(loader.scene);
        this.#scene = loader.scene;
    }

    /**
     * 点击处理
     */
    #onClickProcess() {
        if (!this.#scene) {
            return;
        }

        const repair_process = new RepairProcess(this.#scene);
        this.#preview.container.appendChild(repair_process);
        this.#controller.style.visibility = "hidden";
        repair_process.on_finish = () => {
            this.#controller.style.visibility = "visible";
        };
        repair_process.processAndDownload();
    }
}

CustomElementRegister(tagName, Arena);
